Feature: Group Details

    Scenario: Membership check
        Given I visit the homepage
        When I select group "Public Group A" in category "public"
        And "Test User" is a group admin member of the group
        And "Test Admin" is an admin member of the group

    Scenario: Public group details without login
        Given I go to path "/group/1/public-group-a"
        Then "Group settings" are not visible
        And "Add Game button" is not visible
        And "Games card" is visible
        And "Members card" is visible

    Scenario: Public group details logged in, non-member
        Given I visit the homepage
        When I log in with user "Test User"
        Then I'm logged in with user "Test User"
        When I select group "Public Group B" in category "public"
        Then "Group settings" are not visible
        And "Add Game button" is not visible
        And "Games card" is visible
        And "Members card" is visible
    
    Scenario: Public group details for group admin
        Given I visit the homepage
        When I log in with user "Test User"
        Then I'm logged in with user "Test User"
        When I select group "Public Group A" in category "my"
        Then "Group settings" are visible
        And "Add Game button" is visible
        And "Games card" is visible

    Scenario: Private group details for site admin, non-member
        Given I visit the homepage
        When I log in with user "Test Admin"
        Then I'm logged in with user "Test Admin"
        When I select group "Private Group B" in category "private"
        Then "Group settings" are visible
        And "Games card" is visible
        And "Add Game button" is visible
        And "Members card" is visible

    Scenario: Private group details without login
        Given I go to path "/group/3/private-group-a"
        Then "Toaster" is visible
        And "Group settings" are not visible
        And "Members card" is not visible
        And "Games card" is not visible
        And "Add Game button" is not visible

    