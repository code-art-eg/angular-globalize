import { browser, by, element } from 'protractor';

export class AppPage {
  public navigateTo(): Promise<unknown> {
    return browser.get(browser.baseUrl) as Promise<unknown>;
  }

  public getParagraphText(): Promise<string> {
    return element(by.css('app-root h1')).getText() as Promise<string>;
  }
}
