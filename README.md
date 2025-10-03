# Ethiopian Calendar App

A simple Angular 16 application that demonstrates Ethiopian/Amharic calendar integration using Angular Material datepicker with a custom date adapter.

## Features

- ✅ Ethiopian calendar support with Amharic month names
- ✅ Real-time conversion between Ethiopian and Gregorian dates
- ✅ Angular Material datepicker with custom styling
- ✅ Responsive design for mobile and desktop
- ✅ Sample date buttons for quick testing
- ✅ Angular 16 standalone components

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## Installation

1. Navigate to the project directory:
```bash
cd ethiopian-calendar-app
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

## Running the Application

1. Start the development server:
```bash
npm start
# or
yarn start
```

2. Open your browser and navigate to `http://localhost:4200`

## Building for Production

```bash
npm run build
# or
yarn build
```

The build artifacts will be stored in the `dist/` directory.

## Key Components

### Ethiopian Date Adapter (`src/app/eth-date-adapter.ts`)
- Custom DateAdapter implementation for Angular Material
- Converts between Ethiopian and Gregorian calendars using the `kenat` library
- Provides Amharic month names and proper date formatting

### Main App Component (`src/app/app.component.ts`)
- Standalone Angular component with Material Design
- Interactive datepicker with real-time conversion display
- Sample date buttons for testing different Ethiopian dates

### App Configuration (`src/app/app.config.ts`)
- Angular 16 standalone app configuration
- Providers for the custom date adapter and Material modules

## Dependencies

- **@angular/material**: Material Design components
- **@angular/cdk**: Component Development Kit
- **kenat**: Ethiopian calendar conversion library
- **rxjs**: Reactive programming library

## Ethiopian Calendar Information

The Ethiopian calendar is approximately 7-8 years behind the Gregorian calendar. Key features:

- 13 months (12 months of 30 days + 1 month of 5-6 days)
- New Year falls on September 11 (Gregorian)
- Month names in Amharic script
- Monday is the first day of the week

## Sample Dates

The app includes sample buttons for:
- Ethiopian New Year 2016 (Gregorian: January 1, 2024)
- Ethiopian New Year 2017 (Gregorian: September 11, 2024)
- Christmas 2016 (Ethiopian) (Gregorian: December 25, 2024)

## Customization

You can customize the app by:
- Modifying the date formats in `ETH_AMHARIC_FORMATS`
- Adding more sample dates in the component
- Changing the Material Design theme
- Adding more conversion features

## Browser Support

This app supports all modern browsers that Angular 16 supports, including:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is open source and available under the MIT License.

