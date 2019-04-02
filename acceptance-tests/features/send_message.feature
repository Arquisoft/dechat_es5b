Feature: Can I send a message to a friend?
  I want to know if I can send a message to a contact

  Scenario Outline: Could the user send a message to a friend
	Given I'm using the chat app
    When I send a message "<message>" to a friend
    Then My friend gets the message "<message>"
	
  Examples:
	| message | friend |
	| hi | pruebaes5b |
	| how are you? | martinreycristina |
	| good thanks | srcharlystar |