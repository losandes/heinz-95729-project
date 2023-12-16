import tkinter as tk
from tkinter import scrolledtext
from collaborative import algorithm
from content_based import get_contentbased_recommand
from llm import extract_movie_names, create_conversational_recommendations, generate_movie_names
import numpy as np

permanent_str = ""
non_movie_name_counter = 0
movie_list = []


class Application(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("Movie Recommendation Interface")

        # Set the padding for the main window
        self.main_padding = 20
        self.configure(padx=self.main_padding, pady=self.main_padding)

        # Create a frame for the input field and buttons with some space around them
        self.input_frame = tk.Frame(self)
        self.input_frame.pack(pady=10, fill='x', expand=True)

        # Adjust the width of the input field to leave some space
        input_field_width = 60  # Adjust this width based on your display window size

        # Create the input field within the frame
        self.input_field = tk.Entry(self.input_frame, width=input_field_width)
        self.input_field.grid(row=0, column=0, sticky="ew", padx=(0, 10))

        # Create Enter and Clear buttons within the frame
        self.enter_button = tk.Button(self.input_frame, text="ENTER", command=self.process_input)
        self.enter_button.grid(row=0, column=1, padx=(0, 10))
        self.clear_button = tk.Button(self.input_frame, text="CLEAR", command=self.clear_display)
        self.clear_button.grid(row=0, column=2)

        # Create the display window with some space around it
        self.display_window = scrolledtext.ScrolledText(self, width=100, height=20, state=tk.DISABLED)
        self.display_window.pack(pady=10, fill='both', expand=True)

        # Variable to check if the input is being processed
        self.is_processing = False

        self.input_field.insert(0, "Enter at least 3 movies and their ratings (0~5) to start (e.g., 'Movie1, 5, "
                                   "Movie2, 4.5, ...')")
        self.count = 0

    def process_input(self):
        if not self.is_processing:
            self.is_processing = True
            user_input = self.input_field.get()
            # Clear the input field after getting the input
            self.input_field.delete(0, tk.END)
            # Simulate processing and get the output
            processed_output = self.backend_function(user_input)
            # Display both input and output
            self.display(user_input, processed_output)
            self.is_processing = False
        else:
            print("Please wait until the current input is processed.")

    def display(self, input_str, output_str):
        # Display user input and output in the display window
        self.display_window.config(state=tk.NORMAL)
        # Insert the user input at the end, then insert the output on the same line
        input_tag = f'input_{self.display_window.index(tk.END)}'
        self.display_window.insert(tk.END, input_str + '\n', input_tag)
        # Right-align the output by adding it with right-aligned tag
        output_tag = f'output_{self.display_window.index(tk.END)}'
        self.display_window.insert(tk.END, output_str + '\n\n', output_tag)
        # Apply tags to style the input and output differently if desired
        self.display_window.tag_configure(input_tag, justify='left')
        self.display_window.tag_configure(output_tag, justify='right')
        self.display_window.config(state=tk.DISABLED)
        # Scroll to the end to view the latest entry
        self.display_window.see(tk.END)

    def clear_display(self):
        # Clear the display window
        self.display_window.config(state=tk.NORMAL)
        self.display_window.delete(1.0, tk.END)
        self.display_window.config(state=tk.DISABLED)

    def backend_function(self, input_str):
        self.count += 1
        if self.count == 1:
            try:

                return "\n" + create_conversational_recommendations("",algorithm(input_str)).split("\"")[1].strip()
            except Exception as e:
                return f"Error processing recommendations: {e}"
        else:
            global non_movie_name_counter
            global permanent_str
            global movie_list
            # permanent_str += input_str
            if "None" in extract_movie_names(input_str):
                if non_movie_name_counter == 0:
                    permanent_str += input_str
                    non_movie_name_counter += 1
                    return "\nCould you please offer an example movie to help me recommend?"
                else:
                    gen_movie_name = generate_movie_names(permanent_str).split("\"")[1].strip()
                    movie_list.append(np.array(get_contentbased_recommand(gen_movie_name)['title']))
                    return create_conversational_recommendations(permanent_str,
                                                                 get_contentbased_recommand(gen_movie_name))
            else:
                permanent_str += input_str
                exp_movie_name = extract_movie_names(input_str).split(":")[-1].strip()
                movie_list.append(np.array(get_contentbased_recommand(exp_movie_name)['title']))
                recommend_conv = \
                    create_conversational_recommendations(permanent_str,
                                                          get_contentbased_recommand(exp_movie_name)).split(
                        "\"")[1]
                return "\n" + recommend_conv


# Run the application
app = Application()
app.mainloop()
