Feature: Can I recieve a message from a friend?
  I want to know if I can recieve a message from a contact

  Scenario Outline: Could the user recieve a message from a friend
	Given I'm using the chat app
    When I'm chatting with "pruebaes5b"
    Then I recieve a message "Hi!" from my friend "pruebaes5b"