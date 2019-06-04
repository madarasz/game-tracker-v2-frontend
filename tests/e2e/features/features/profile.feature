Feature: Profile

    Scenario: Upload and remove profile image
        Given I visit the homepage
        When I log in with user "Test User"
        Then I'm logged in with user "Test User"
        When I navigate to "my profile"
        Then "profile settings" are visible
        Given profile image is removed
        Then "profile placeholder" is visible
        When I upload a profile picture
        Then "profile picture" is visible
        When I remove my profile picture
        Then "profile placeholder" is visible

    Scenario: Profile settings is not visible for other user
        Given I visit the homepage
        When I log in with user "Test User"
        Then I'm logged in with user "Test User"
        When I go to path "/profile/2/test-admin"
        Then "profile settings" is not visible

    Scenario: Profile settings is visible for admin
        Given I visit the homepage
        When I log in with user "Test Admin"
        Then I'm logged in with user "Test Admin"
        When I go to path "/profile/1/test-user"
        Then "profile settings" are visible