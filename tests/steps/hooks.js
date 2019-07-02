import { callbackify } from "util";

// BeforeAll(function() {
//   browser.addCommand("dragAndDropCustom", (source, target) => {
//     browser.moveToObject(source.selector);
//     browser.buttonDown(0);
//     browser.moveToObject(target.selector);
//     browser.buttonUp(0);
//   });
// });

BeforeAll(function() {
  browser.addCommand("customScroll", selector => {
    browser.execute(selector => {
      const word = document.querySelector(selector);
      const { y } = word.getBoundingClientRect();
      window.scrollTo(0, y);
    }, selector);
  });
});
