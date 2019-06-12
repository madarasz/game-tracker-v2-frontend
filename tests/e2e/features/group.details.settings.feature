Feature: Group Details Settings

    Scenario: Upload and remove group image
        Given I visit the homepage
        When I log in with user "Test User"
        Then I'm logged in with user "Test User"
        When I select group "Public Group A" in category "my"
        Then "Group Settings" are visible
        Given group image is removed
        Then "Group image placeholder" is visible
        When I upload a group image
        Then "Group image" is visible
        When I remove group image
        Then "Group image placeholder" is visible

    