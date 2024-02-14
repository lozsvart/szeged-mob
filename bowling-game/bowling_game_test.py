import unittest
import bowling_game


class BowlingGameTest(unittest.TestCase):
    def test_gutterGame_shouldReturn0(self):
        self.assertEqual(0, bowling_game.score([0]))

    def test_allOnes_shouldReturn20(self):
        self.assertEqual(20, bowling_game.score([1]*20))

    def test_spareShouldDoubleTheNextRoll(self):
        self.assertEqual(12, bowling_game.score([5, 5, 1]))

if __name__ == '__main__':
    unittest.main()
