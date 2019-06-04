Feature: Login

    Scenario: Can login and logout with user
        Given I visit the homepage
        When I log in with user "Test User"
        Then I'm logged in with user "Test User"
        When I log out
        Then "Login button" is visible

    Scenario: Cannot log in with wrong password
        Given I visit the homepage
        When I log in with email "e2e@test.com" and password "pass!!!"
        Then "Login button" is visible
        And "Toaster" is visible

    Scenario: Login state is perserved
        Given I visit the homepage
        When I log in with user "Test User"
        Then I'm logged in with user "Test User"
        When I visit the homepage
        Then I'm logged in with user "Test User"