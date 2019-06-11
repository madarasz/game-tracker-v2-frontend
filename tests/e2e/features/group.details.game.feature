Feature: Group Details Games

    Scenario: Public group details without login
        Given I visit the homepage
        When I log in with user "Test User"
        Then I'm logged in with user "Test User"
        When I select group "Public Group A" in category "my"
        And I click "Add game button"
        Then "Add game dialog" is visible
        When I search for game "Monopol"
        Then "Monopoly" is visible in game search results

    