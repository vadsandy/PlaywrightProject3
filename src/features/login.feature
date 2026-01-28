Feature: Login Functionality

  @UI @JSON
  Scenario: Login via JSON
    Given I navigate to the DemoQA login page
    When I login using "json" data from "data/json/users.json" and key "validUser"
    Then I should verify if the login was successful

  @UI @SQL
  Scenario: Login via SQL Database
    Given I navigate to the DemoQA login page
    When I login using "sql" data from "SELECT username, password FROM Users WHERE username='testuser1'" and key ""
    Then I should verify if the login was successful

  @API @JSON
  Scenario: Verify User Account Status via API
    When I perform an API login using "json" data from "data/json/users.json" and key "validUser"
    Then the API response should indicate success with a valid token
    And I should be able to fetch user account details using the token