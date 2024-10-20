# Weather Dashboard

This project is a Weather Dashboard designed to display real-time weather information, offering a clean and responsive user interface. It features a sidebar navigation menu, weather search bar, forecast cards, and a weather details section. The layout adjusts seamlessly across various devices, ensuring a smooth experience for all users.

## Features

- **Responsive Layout**: Adapts to different screen sizes, ensuring optimal display on mobile, tablet, and desktop.
- **Weather Search**: Search for weather updates by entering a location.
- **Forecast Cards**: Displays weather forecasts in an easy-to-read card format.
- **User Profile**: Includes a profile menu with a profile picture and options.
- **Loading Animation**: Shows a loading spinner while weather data is being fetched.
- **Filter Dropdown**: Allows filtering of weather information based on user preferences.

## Technologies Used

- **HTML5**: For creating the structure of the dashboard.
- **CSS3**: For styling the user interface and handling responsiveness.
- **JavaScript (optional)**: Can be used for future API integration for dynamic weather updates.
- **CSS Grid & Flexbox**: Used for structuring the layout and ensuring responsive design.
- **Media Queries**: To manage layout adjustments for different screen sizes.

## Getting Started

### Prerequisites

To run this project locally, you only need a web browser. No additional dependencies are required.

### Installation

1. **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/weather-dashboard.git
    ```

2. **Navigate to the project directory**:
    ```bash
    cd weather-dashboard
    ```

3. **Open the `index.html` file in your browser** to view the dashboard:
    - On MacOS/Linux:
      ```bash
      open index.html
      ```
    - On Windows:
      ```bash
      start index.html
      ```

## Usage

- **Search Weather**: Use the search bar to look up the weather by city or location.
- **View Forecasts**: Scroll through the weather cards for forecast details.
- **Filter Weather Data**: Use the dropdown to filter weather information.
- **Loading Spinner**: Displays a loader while the data is being retrieved (placeholder feature).
- **User Profile**: The profile section shows a user avatar and dropdown menu for navigation options (if applicable).

## Project Structure

```bash
weather-dashboard/
│
├── index.html          # Main HTML file
├── css/
│   └── styles.css      # CSS file for styling the project
├── js/
│   └── script.js       # JavaScript file for dynamic behavior (optional)
└── README.md           # Project documentation
