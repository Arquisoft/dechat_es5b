Feature: Can I send a message to a friend?
  I want to see my friend's list

  Scenario Outline: Could the user see his friends list
	Given I'm using the chat app
    When I want to start a chat with my friend "<friend>"
    Then "<friend>" appears in the friends list
	
  Examples:
	| friend |
	| pruebaes5b |
	| martinreycristina |
	| srcharlystar |