def score(rolls):
    sum = 0
    frames = []
    for roll_index in range(0, len(rolls), 2):
        frame_content = rolls[roll_index:roll_index+2]
        frames.append(frame_content)

        if len(frames) > 1 and is_spare(frames[-2]):
            sum += rolls[roll_index]

    for roll in rolls: 
        sum += roll
    return sum


def is_spare(frame):
    return sum(frame) == 10
