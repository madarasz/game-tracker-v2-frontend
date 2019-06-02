Feature: Group Selector

    Scenario: Groups with and without login
        Given I visit the homepage
        Then I can see the following groups in group selector:
            | group             | category  |
            | Public Group A    | public    |
            | Public Group B    | public    |
            | Private Group A   | private   |
            | Private Group B   | private   |
        When I log in with user "Test User"
        Then I can see the following groups in group selector:
            | group             | category  |
            | Public Group A    | my        |
            | Public Group B    | public    |
            | Private Group A   | my        |
            | Private Group B   | private   |
        #And I can see the admin icon for group Public Group A
        #When I log out
        #Then I can see the following groups
        #    | group             | category  |
        #    | Public Group A    | public    |
        #    | Public Group B    | public    |
        #    | Private Group A   | private   |
        #    | Private Group B   | private   |