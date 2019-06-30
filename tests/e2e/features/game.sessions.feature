Feature: Game Sessions

    Scenario: Creating, modifying and deleting game sessions
        Given I visit the homepage
        When I log in with user "Test User"
        Then I'm logged in with user "Test User"
        When I select group "Public Group A" in category "my"
        And I select game "Agricola" from the list
        Then "Game title" has value "Agricola"
        And "Add session button" is visible
        And "Session details card" is not visible
        Given I delete all sessions with place "Testcave" 
        Given I delete all sessions with place "Testplace"
        When I click "Add session button"
        Then "Session details card" is visible
        When I edit session: place "Testcave" and notes "test session"
        And I click "Save session button"
        Then there is a session with place "Testcave"
        When I select session with place "Testcave"
        Then "Session place value" has value "Testcave"
        And "Session notes value" has value "test session"
        When I click "Edit session button"
        And I edit session: place "Testplace" and notes "the second try"
        And I click "Update session button"
        Then there is a session with place "Testplace"
        When I select session with place "Testplace"
        Then "Session place value" has value "Testplace"
        And "Session notes value" has value "the second try"
        When I delete the current session
        Then "Session details card" is not visible
        And there is no session with place "Testplace"

    Scenario: Authorization for session edit
        Given I go to path "/group/9001/public-group-a/31260/agricola"
        When I select session with place "Safespace"
        Then "Add session button" is not visible
        And "Edit session button" is not visible
        And "Delete session button" is not visible
        When I log in with user "Test User"
        Then I'm logged in with user "Test User"
        And "Add session button" is visible
        And "Edit session button" is visible
        And "Delete session button" is visible
        When I log out
        And I log in with user "Test Admin"
        Then I'm logged in with user "Test Admin"
        And "Add session button" is visible
        And "Edit session button" is visible
        And "Delete session button" is visible
        When I log out
        And I log in with user "Test User2"
        Then I'm logged in with user "Test User2"
        And "Add session button" is not visible
        And "Edit session button" is not visible
        And "Delete session button" is not visible

    Scenario: Adding and removing images from sessions
        Given I visit the homepage
        When I log in with user "Test User"
        Then I'm logged in with user "Test User"
        When I select group "Public Group A" in category "my"
        And I select game "Agricola" from the list
        Then "Game title" has value "Agricola"
        When I select session with place "Safespace"
        And  I delete all images in the session
        Then "no images message" is visible
        When I upload a picture
        Then "no images message" is not visible
        When I delete all images in the session
        Then "no images message" is visible




    