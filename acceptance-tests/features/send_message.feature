Feature: Can I send a message to a friend?
  I want to know if I can send a message to a contact

  Scenario Outline: Could the user send a message to a friend
	Given I'm "<me>", and I'm using the chat app with my friend "<friend>"
    When I send a message "<message>" to my "<friend>" friend
    Then My friend "<friend>" gets the message "<message>"
	
  Examples:
	| message | friend | me
	| hi | pruebaes5b | jandrolaviana
	| how are you? | martinreycristina | pruebaes5b
	| good thanks | srcharlystar | martinreycristina