# Radview Webload and headless Chrome using Selenium
How-To configure Chrome webbrowser in headless-mode within Radview Webload using Selenium.

# Explanation
Out of the box Radview Webload does not offer the headless-mode for Google Chrome. Since it does support Google Chrome it is a matter of providing the required parameters ;-)

When installed using default settings, you can find selenium.js in C:\Program Files (x86)\RadView\WebLOAD\include\

The following lines need to be added to selenium.js:

```diff
16a17,22
>       case "ChromeHeadless":
>         options = new Packages.org.openqa.selenium.chrome.ChromeOptions();
>         var opt = ["headless","disable-gpu"];
>         options.addArguments(opt);
>         driver  = new Packages.org.openqa.selenium.chrome.ChromeDriver( options );
>         break;
```

Or simply copy selenium.js from the files/ directory and replace the original file with this one.

# Usage
After updating selenium.js it's easy to switch headless on/off.

## Chrome Headless OFF
The picture below shows the default initialisation of a WebLoad project using Selenium with Google Chrome:
![SeleniumUsingChrome](https://github.com/tmvtmv/RadviewWebloadHeadlessChrome/blob/master/images/Webload_IDE-Chrome.jpg)

## Chrome Headless ON
Just change Chrome to ChromeHeadless in the line driver=createDriver("Chrome").
The picture below shows a small change switching to headless-mode for Google Chrome:
![SeleniumUsingChromeHeadless](https://github.com/tmvtmv/RadviewWebloadHeadlessChrome/blob/master/images/Webload_IDE-ChromeHeadless.jpg)

# Supported versions of WebLoad
Although no guarantees are given, I can confirm this to work for release 11.2.0.63. See https://www.radview.com/change-log/ for all versions.
