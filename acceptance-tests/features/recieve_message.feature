Feature: Can I recieve a message from a friend?
  I want to know if I can recieve a message from a contact

  Scenario Outline: Could the user recieve a message from a friend
	Given I'm using the chat app
    When I'm chatting with "martinreycristina"
    Then I recieve a message "Hi!" from my friend "martinreycristina"
	
  Examples:
	| friend				| me						|
    | Send "Hi"				| I can read "Hi"			|
	| Send "How are you?"	| I can read "How are you"	|