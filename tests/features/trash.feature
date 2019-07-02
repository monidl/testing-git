# Feature: Drag and Drop
#     Scenario: Drag newspaper images and drop images to trash can 
#         Given the user is in the home page
#         # When the user selects the newspaper image 
#         When the user drags and drops the newspaper image to the trash can icon
#         Then the image is now inside the trash can

Feature: Git Scroll
    Scenario: Scroll until element is visible
        Given the user is in the GitHub home page
        When the user scrolls down unitl the Learn how GitHub Enterprise works button
        Then the element is now visible