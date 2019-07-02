// import trashPO from "../page_objects/trash";

// When(
//   /^the user drags and drops the newspaper image to the trash can icon$/,
//   function() {
//     browser.pause(2000);
//     browser.dragAndDropCustom(trashPO.target, trashPO.destination);
//     browser.pause(2000);
//   }
// );

When(
  /^the user scrolls down unitl the Learn how GitHub Enterprise works button$/,
  function() {
    browser.customScroll(".d-sm-inline");
    browser.pause(3000);
  }
); 
