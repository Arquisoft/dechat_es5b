Feature: Can I send a message to nobody?
  I want to know if I can send a message without chosing a friend

  Scenario Outline: Could the user send a message without chosing a friend?
	Given I'm "<me>", and I'm using the chat app
    When I send a message "<message>" to nobody
    Then The chat says I can't send the message
	
  Examples:
	| message | me
	| hi | jandrolaviana
	| how are you? | pruebaes5b
	| good thanks | martinreycristina
