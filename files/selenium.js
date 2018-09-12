
function createDriver(type) {
  //Initialize 
  Packages.java.lang.Thread.currentThread().setContextClassLoader(Packages.java.lang.ClassLoader.getSystemClassLoader());
  By = Packages.org.openqa.selenium.By;
  Select = Packages.org.openqa.selenium.support.ui.Select
  
  var driver
  try {
    switch (type) {
      case "FireFox":
        driver = new Packages.org.openqa.selenium.firefox.FirefoxDriver();
        break;
      case "Chrome":
        driver = new Packages.org.openqa.selenium.chrome.ChromeDriver();
        break;
      case "ChromeHeadless":
        options = new Packages.org.openqa.selenium.chrome.ChromeOptions();
        var opt = ["headless","disable-gpu"];
        options.addArguments(opt);
        driver  = new Packages.org.openqa.selenium.chrome.ChromeDriver( options );
        break;
      case "InternetExplorer":
        driver = new Packages.org.openqa.selenium.ie.InternetExplorerDriver();
        break;
      case "HtmlUnit":
		driver = new Packages.org.openqa.selenium.htmlunit.HtmlUnitDriver(true);
		break;
      default:
        throw "Unknown driver type: " + type;
        return null;
    }
    driver.manage().timeouts().implicitlyWait(1, Packages.java.util.concurrent.TimeUnit.SECONDS);
    return driver;
  } catch(e) {
    ErrorMessage("Failed to create driver " + type + ", :" + e);
  }
}

function getTiming(timingObj,rName) {
  return timingObj.get(rName);
}

function Se_Timer(timerName, pageName, end, start) {
  if (end<=0 || start<=0) {
    return;
  }
  SendMeasurement("Selenium " + timerName + " Time", (end - start)/1000 );
  if (pageName && pageName != "") {
    SendMeasurement("Selenium (" + pageName + ") " + timerName + " Time", (end - start)/1000 );
  }
}	

//logger = logger || { debug : function(msg) {InfoMessag	e(msg);} };
function reportStatistics(driver, pageName) {
  try {
    var timingObj = driver.executeScript("return window.performance.timing;", []);
	if (typeof(timingObj.get)==="undefined") {
		DebugMessage("Cannot get navigation timing. Incompatible object " + timingObj.toString() );
	}
  var navigationStart =  getTiming(timingObj, "navigationStart");
  var redirectStart  =  getTiming(timingObj, "redirectStart");
  var redirectEnd  =  getTiming(timingObj, "redirectEnd");
  var fetchStart  =  getTiming(timingObj, "fetchStart");
  var domainLookupStart  =  getTiming(timingObj, "domainLookupStart");
  var domainLookupEnd  =  getTiming(timingObj, "domainLookupEnd");
  var connectStart  =  getTiming(timingObj, "connectStart");
  var connectEnd =  getTiming(timingObj, "connectEnd");
  var requestStart =  getTiming(timingObj, "requestStart");
  var responseStart =  getTiming(timingObj, "responseStart"); //first byte
  var responseEnd =  getTiming(timingObj, "responseEnd"); //last byte
  var domLoading = getTiming(timingObj, "domLoading");
  var domInteractive = getTiming(timingObj, "domInteractive");
  var domContentLoadedEventStart = getTiming(timingObj, "domContentLoadedEventStart");
  var domContentLoadedEventEnd = getTiming(timingObj, "domContentLoadedEventEnd");
  var domComplete = getTiming(timingObj, "domComplete");
  var loadEventStart = getTiming(timingObj, "loadEventStart");
  var loadEventEnd = getTiming(timingObj, "loadEventEnd");
	
  if (logger) {
	var msg="Performance Timing " + pageName
	+ " Se Connect: " + (connectEnd - connectStart) 
	+ ", Se Request: " + (responseStart - requestStart)
	+ ", Se Response: " + (responseEnd - responseStart)
	+ ", Se Processing: " + (loadEventStart - responseEnd)
	+ ", Se onLoad: " + (loadEventEnd - loadEventStart)
	+ ", Se Full: " + (loadEventEnd - navigationStart)
	+ ", Timing: navigationStart:" + navigationStart 
	+ ", connectStart:" + connectStart 
	+ ", connectEnd:" + connectEnd 
	+ ", requestStart:" + requestStart 
	+ ", responseStart:" + responseStart 
	+ ", responseEnd:" + responseEnd 
	+ ", loadEventEnd:" + loadEventEnd 
	+ ", loadEventStart:" + loadEventStart;
	logger.debug(msg);
	}

  Se_Timer("Redirect", pageName, redirectEnd, redirectStart);
  Se_Timer("App Cache", pageName, fetchStart, redirectEnd);
  Se_Timer("DNS", pageName, domainLookupEnd, domainLookupStart);
  Se_Timer("Connect", pageName, connectEnd, connectStart);
  Se_Timer("Page Request", pageName, responseStart, requestStart);
  Se_Timer("First Byte", pageName, responseStart, navigationStart); //First Byte is calculated since the beginning, and not since request end like in WebLOAD
  Se_Timer("Last Byte", pageName, responseEnd, navigationStart);
  Se_Timer("Page Response", pageName, responseEnd, responseStart);
  Se_Timer("domInteractive", pageName, domInteractive, navigationStart); //from navigation start
  Se_Timer("domContentLoaded", pageName, domContentLoadedEventStart, navigationStart); //from navigation start, to domContentLoadedEvent-Start (not end, meaning, all content load but not including the javascript execution)
  Se_Timer("Processing", pageName, loadEventStart, responseEnd);
  Se_Timer("onLoad", pageName, loadEventEnd, loadEventStart);
  Se_Timer("Full Page", pageName, loadEventEnd, navigationStart);

    } catch (e) {
	  DebugMessage("Cannot get navigation timing. " + e);
	  return;
  }

}

function isElementPresent(by) {
    try {
        driver.findElement(by);
        return true;
    } catch (e) { //NoSuchElementException
        return false;
    }
}

function isAlertPresent() {
    try {
        driver.switchTo().alert();
        return true;
    } catch ( e) { //NoAlertPresentException
        return false;
    }
}

function closeAlertAndGetItsText() {
    try {
        alert = driver.switchTo().alert();
        alertText = alert.getText();
        if (acceptNextAlert) {
            alert.accept();
        } else {
            alert.dismiss();
        }
        return alertText;
    } finally {
        acceptNextAlert = true;
    }
}

//runJunit([Packages.com.example.cucumberWebLoad.GatewayHealthcheckSanity], true)
function runJunit( classes, debugStdout ) {
  Packages.java.lang.Thread.currentThread().setContextClassLoader(Packages.java.lang.ClassLoader.getSystemClassLoader());
  Packages.com.radview.webload.selenium.WebLoadWrapper.setThreadWebLoadRootObject(this);
  if (debugStdout) { 
	    var baos = new Packages.java.io.ByteArrayOutputStream();
	    var ps = new Packages.java.io.PrintStream(baos);
        var old = Packages.java.lang.System.out;
	    Packages.java.lang.System.setOut(ps);
  }
    //Single class given, but runClasses expects an array
  if ( typeof(classes)==="function") {
	classes = [classes];
  }

	try 
	{
		for (i = 0; i < classes.length; i++)
		{
			var clsname="";
			clsname+=classes[i];
			// we have JavaPackage and not JavaClass, a clear sign the class wasn't found
			if (clsname[5] == 'P')
			{
				ErrorMessage(classes[i] + " cannot be found");
			} 
			/*else if (clsname[5] == 'C')
			{
				InfoMessage("Java Class " + classes[i] + " was found");
			}*/
		}
		ret = Packages.org.junit.runner.JUnitCore.runClasses(classes);
  
		if (debugStdout) { 
		  Packages.java.lang.System.out.flush();
		  Packages.java.lang.System.setOut(old);
		  InfoMessage("standard out: " + baos.toString());
		}
   	    
		InfoMessage("Ran " + ret.getRunCount() + " test. Failed: " + ret.getFailureCount() + ":" + ret.getFailures());
		return ret.wasSuccessful(); 		
	} catch(e) {
      ErrorMessage(e);
    }
}
