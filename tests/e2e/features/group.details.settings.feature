Feature: Group Details Settings

    Scenario: Upload and remove group image
        Given I visit the homepage
        When I log in with user "Test User"
        Then I'm logged in with user "Test User"
        When I select group "Public Group A" in category "my"
        Then "Group edit button" is visible
        When I click "Group edit button"
        Given group image is removed
        Then "Group image placeholder" is visible
        When I upload a group image
        Then "Group image" is visible
        When I remove group image
        Then "Group image placeholder" is visible

    # TODO: create group to play with
    Scenario: Edit Group details
        Given I visit the homepage
        When I log in with user "Test User"
        Then I'm logged in with user "Test User"
        When I select group "Public Group A" in category "my"
        When I click "Group edit button"
        And I edit group settings: public="false", name="Public Group A 12345"
        When I log out
        And I visit the homepage
        Then I can see the following groups in group selector:
            | group                 | category  |
            | Public Group A 12345  | private   |
        When I log in with user "Test Admin"
        When I select group "Public Group A 12345" in category "my"
        When I click "Group edit button"
        And I edit group settings: public="true", name="Public Group A"
        And I log out
        And I visit the homepage
        Then I can see the following groups in group selector:
            | group          | category  |
            | Public Group A | public    |

    