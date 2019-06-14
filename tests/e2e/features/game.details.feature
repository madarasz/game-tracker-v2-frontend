Feature: Game Details

    Scenario: Game Details
        Given I go to path "/group/1/public-group-a/31260/agricola"
        Then "Game details" are visible
        And "Game title" has value "Agricola"
        And "Game designer" has value "Uwe Rosenberg"
        And "BGG rating" is visible

    