Feature: Can I recieve a message from a friend?
  I want to know if I can recieve a message from a contact

  Scenario Outline: Could the user recieve a message from a friend
	Given I'm "<me>", and I'm using the chat app with my friend "<friend>"
    When I'm chatting with "<friend>"
    Then I recieve a message "<message>" from my friend "<friend>"

  Examples:
	| message | friend | me
	| hi | pruebaes5b | jandrolaviana
	| how are you? | martinreycristina | pruebaes5b
	| good thanks | srcharlystar | martinreycristina