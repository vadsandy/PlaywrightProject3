Feature: Login Negative Scenarios

@UI @JSON @Negative
Scenario: Login failure via JSON
    When I login using "json" data from "data/json/users.json" and key "invalidUser"
    Then I should see an error message "Invalid username or password!"

@UI @Excel @Negative
Scenario: Login failure via Excel
    When I login using "excel" data from "data/excel/users.xlsx" and key "invalidUser"
    Then I should see an error message "Invalid username or password!"

@UI @SQL @Negative
Scenario: Loin failure via SQL
    When I loing using "sql" data from "SELECT username, password FROM Users WHERE username = 'invalid_user' and key=""
    Then I should see an error message "Invalid username or password!"
