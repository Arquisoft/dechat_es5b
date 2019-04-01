Feature: Can I send a message to a friend?
  I want to know if I can send a message to a contact

  Scenario Outline: Could the user send a message to a friend
	Given I'm using the chat
    When I send a message "<message>" to a friend
    Then My friend gets the message "<message>"
	
  Examples:
	| sender		| reciever				|
    | Hi 			| Hello 				|
	| How are you? 	| Fine thanks and you?	|
	| Fine too 		| Cool					|