Feature: Group Details

    Scenario: Group admin has access to group settings
        Given I visit the homepage
        When I log in with user "Test User"
        Then I'm logged in with user "Test User"
        When I select group "Public Group A" in category "my"
        Then "Group settings" are visible
        And "Test User" is a group admin member of the group
        And "Test Admin" is an admin member of the group

    Scenario: Group settings are not visible without logout
        Given I go to path "/group/1/private-group-a"
        Then "Group settings" are not visible

    Scenario: Group settings are visible for Admin
        Given I visit the homepage
        When I log in with user "Test Admin"
        Then I'm logged in with user "Test Admin"
        When I select group "Private Group B" in category "private"
        Then "Group settings" are visible

    Scenario: Private group details are not visible
        Given I go to path "/group/3/private-group-a"
        Then "Group settings" are not visible
        And "Members card" is not visible
        And "Games card" is not visible