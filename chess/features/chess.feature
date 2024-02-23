Feature: Chessboard properties

    Scenario:
        Given I have an empty board
        When I put a piece on "A1"
        Then I should have 1 piece on the board

    Scenario:
        Given I have a board with a piece on "A1"
        When I put a piece on "A2"
        Then I should have 2 pieces on the board

    Scenario:
        Given I have a board with a piece on "A1"
        When I put a piece on "A1"
        Then I should have 1 piece on the board

    Scenario:
        Given I have a board with a "rook" on "A1"
        When I query the fields the piece on "A1" is able to move
        Then the result should contain 14 elements
        And the result should contain all of "A2, A3" as elements
        And the result should contain none of "B2" as elements
