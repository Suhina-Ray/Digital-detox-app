import time

# Initialize user data
user_focus_history = []  # Stores focus time for each session
user_feedback_history = []  # Stores feedback ratings

# Function to start the Pomodoro timer
def start_focus_session(focus_duration):
    print(f"Starting focus session for {focus_duration} minutes...")
    start_time = time.time()  # Start the timer
    
    # Simulate the user studying for the focus_duration
    time.sleep(focus_duration * 60)  # This is where the timer is simulated (in seconds)
    
    end_time = time.time()  # End the timer
    focus_time = (end_time - start_time) / 60  # Focus time in minutes
    print(f"Session complete! You focused for {focus_time:.2f} minutes.")
    
    # Save focus time to user history
    user_focus_history.append(focus_time)
    
    # Ask for feedback
    get_user_feedback()

# Function to get user feedback after each session
def get_user_feedback():
    while True:
        try:
            rating = int(input("How focused were you on a scale of 1-5? (1 = Not focused, 5 = Very focused): "))
            if 1 <= rating <= 5:
                user_feedback_history.append(rating)
                print("Thank you for your feedback!")
                break
            else:
                print("Please enter a rating between 1 and 5.")
        except ValueError:
            print("Please enter a valid number between 1 and 5.")

# Function to calculate average focus time
def calculate_average_focus_time():
    if len(user_focus_history) > 0:
        avg_focus_time = sum(user_focus_history) / len(user_focus_history)
        return avg_focus_time
    return 0

# Function to suggest optimal focus time based on user behavior
def get_optimal_focus_time():
    avg_focus_time = calculate_average_focus_time()
    print(f"Your average focus time is: {avg_focus_time:.2f} minutes.")
    
    if avg_focus_time < 20:
        return 15  # Suggest shorter focus time if average is less than 20 minutes
    elif avg_focus_time >= 20 and avg_focus_time < 30:
        return 25  # Default Pomodoro session time
    else:
        return 30  # Suggest longer session for highly focused users

# Main function to simulate study session flow
def start_new_session():
    print("\nLet's begin a new study session!")
    
    optimal_time = get_optimal_focus_time()
    print(f"We suggest you focus for {optimal_time} minutes this session.")
    
    start_focus_session(optimal_time)

# Main loop to simulate repeated study sessions
def main():
    while True:
        start_new_session()
        another_session = input("Do you want to start another study session? (y/n): ")
        if another_session.lower() != 'y':
            print("Good job! Keep up the great work!")
            break

# Run the app
if __name__ == "__main__":
    main()
