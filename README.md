# AI Data Insights Analyst — Analyst in a Box

**Use Case 5 — AI Hackathon Lucknow Feb 21' 2026**

An intelligent data analysis system that automatically performs EDA (Exploratory Data Analysis), generates insights, and creates interactive HTML dashboard reports from any CSV file.

## 🚀 Features

- **Automatic Data Cleaning**: Removes empty rows/columns, handles missing values, deduplicates
- **Statistical Analysis**: Summary statistics, correlation analysis, trend detection, outlier identification
- **Interactive Visualizations**: Distribution charts, correlation heatmaps, categorical analysis
- **AI-Powered Insights**: Business insights generated using OpenAI GPT models
- **Interactive HTML Dashboard**: Beautiful, responsive dashboard with all insights and charts
- **Fast Processing**: Complete analysis in ~10 seconds

## 📋 Prerequisites

- Python 3.8 or higher
- OpenAI API key (optional, for AI insights)

## 🛠️ Installation

1. **Clone or download this repository**

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up environment variables**:
   - Create a `.env` file in the project root
   - **For Azure OpenAI** (recommended):
     ```
     AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
     AZURE_OPENAI_API_KEY=your_azure_api_key_here
     AZURE_OPENAI_DEPLOYMENT=gpt-4o-mini
     AZURE_OPENAI_API_VERSION=2024-12-01-preview
     ```
   - **For standard OpenAI** (alternative):
     ```
     OPENAI_API_KEY=your_openai_api_key_here
     OPENAI_MODEL=gpt-4o-mini
     ```

## 📖 Usage

### Basic Usage

```bash
python main.py path/to/your/data.csv
```

Or run without arguments to be prompted for the file path:

```bash
python main.py
```

### Example

```bash
python main.py data/customer_data.csv
```

The system will:
1. Load and clean the CSV file
2. Perform statistical analysis
3. Generate visualizations
4. Create AI-powered insights (if API key is configured)
5. Generate an interactive HTML dashboard

The dashboard will be saved in the `output/` directory with a timestamp.

## 📁 Project Structure

```
.
├── main.py                 # Main entry point
├── requirements.txt        # Python dependencies
├── .env.example           # Environment variables template
├── .gitignore             # Git ignore file
├── README.md              # This file
├── src/
│   ├── __init__.py
│   ├── agents/
│   │   ├── __init__.py
│   │   ├── data_understanding.py    # Data loading and cleaning
│   │   ├── analysis_planner.py      # Visualization planning
│   │   └── insight_generator.py     # AI insights generation
│   ├── engine/
│   │   ├── __init__.py
│   │   └── statistical_engine.py   # Statistical analysis
│   ├── visualization/
│   │   ├── __init__.py
│   │   └── visualization_agent.py  # Chart generation
│   └── report/
│       ├── __init__.py
│       └── dashboard_generator.py   # HTML dashboard creation
├── output/                # Generated dashboards
├── charts/                # Chart images (if needed)
└── data/                  # Sample data files
```

## 🔧 Configuration

### Environment Variables

Edit the `.env` file to configure:

**Azure OpenAI (Recommended):**
- `AZURE_OPENAI_ENDPOINT`: Your Azure OpenAI endpoint URL
- `AZURE_OPENAI_API_KEY`: Your Azure OpenAI API key
- `AZURE_OPENAI_DEPLOYMENT`: Deployment name (e.g., `gpt-4o-mini`)
- `AZURE_OPENAI_API_VERSION`: API version (default: `2024-12-01-preview`)

**Standard OpenAI (Alternative):**
- `OPENAI_API_KEY`: Your OpenAI API key
- `OPENAI_MODEL`: Model to use (default: `gpt-4o-mini`)

**Other Settings:**
- `OUTPUT_DIR`: Output directory for dashboards (default: `output`)
- `CHARTS_DIR`: Directory for chart images (default: `charts`)

**Note:** The system prioritizes Azure OpenAI if both are configured. If neither is configured, the system will still work but AI-generated insights will be replaced with basic statistical summaries.

## 📊 Dashboard Features

The generated HTML dashboard includes:

- **Dataset Overview**: Row/column counts, data types
- **Data Cleaning Summary**: Before/after cleaning statistics
- **Business Insights**: AI-generated actionable insights
- **Key Statistics**: Summary statistics table
- **Interactive Charts**: 
  - Distribution histograms
  - Correlation heatmaps
  - Categorical bar charts
- **Trend Analysis**: Linear trend detection and R² values
- **Outlier Detection**: Number of outliers identified

## 🎨 Customization

You can customize the dashboard by modifying:
- `src/report/dashboard_generator.py`: HTML template and styling
- `src/visualization/visualization_agent.py`: Chart types and configurations

## ⚠️ Troubleshooting

### Common Issues

1. **OpenAI API Error**: 
   - Check that your API key is correctly set in `.env`
   - Ensure you have sufficient API credits

2. **File Not Found**:
   - Use absolute paths or ensure the CSV file is in the correct location
   - Check file permissions

3. **Memory Issues**:
   - For very large datasets (>1GB), consider sampling the data first
   - The system limits visualizations to top columns for performance

## 📝 License

This project is created for the AI Hackathon Lucknow Feb 21' 2026.

## 🤝 Contributing

This is a hackathon project. Feel free to fork and improve!

## 📧 Contact

For questions or issues, please refer to the hackathon organizers.

---

**Built with ❤️ for AI Hackathon Lucknow Feb 21' 2026**
