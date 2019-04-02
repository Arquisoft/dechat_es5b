Feature: Can I recieve a message from a friend?
  I want to know if I can recieve a message from a contact

  Scenario Outline: Could the user recieve a message from a friend
	Given I'm using the chat app
    When I'm chatting with "<friend>"
    Then I recieve a message "<message>" from my friend "<friend>"

  Examples:
	| message | friend |
	| hi | pruebaes5b |
	| how are you? | martinreycristina |
	| good thanks | srcharlystar |