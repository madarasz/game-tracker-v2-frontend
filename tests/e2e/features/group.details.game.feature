Feature: Group Details Games

    Scenario: Adding boardgame to group
        Given I visit the homepage
        When I log in with user "Test User"
        Then I'm logged in with user "Test User"
        When I select group "Public Group A" in category "my"
        Given I delete game "Monopoly" if it is listed
        And I click "Add game button"
        Then "Add game dialog" is visible
        When I search for game "Monopol"
        Then "Monopoly" is visible in the game search results
        When I select "Monopoly" from the game search results
        And I click "Submit add game button"
        Then "Monopoly" is visible in the games of the group

    Scenario: Adding videogame to group
        Given I visit the homepage
        When I log in with user "Test User"
        Then I'm logged in with user "Test User"
        When I select group "Public Group A" in category "my"
        Given I delete game "Duck Game" if it is listed
        And I click "Add game button"
        Then "Add game dialog" is visible
        When I search for game "Duck G"
        And I click "Videogame search"
        Then "Duck Game" is visible in the game search results
        When I select "Duck Game" from the game search results
        And I click "Submit add game button"
        Then "Duck Game" is visible in the games of the group
    