import { Container, TextField, Typography, Box, FormControl, InputLabel, MenuItem, Select, Button, CircularProgress, createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import './App.css'
import React, { useState } from 'react';
import axios from 'axios';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});


function App() {

  const [emailContent, setEmailContent] = useState('');
  const [tone, setTone] = useState('');
  const [generatedReply, setGeneratedReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post("http://localhost:8080/api/email/generate", {
        emailContent,
        tone
      });
      setGeneratedReply(typeof response.data === 'string' ? response.data : JSON.stringify(response.data));
    } catch (err) {
      setError('Failed to generate email reply. plese try again');
      console.error(err);
    }
    finally {
      setLoading(false);
    }

  };
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant='h3' component="h1" gutterBottom>
          Email Reply Generator
        </Typography>
        <Box sx={{ mx: 3 }}>
          <TextField fullWidth multiline rows={6}
            variant='outlined'
            label="Original Email Content"
            value={emailContent || ''}
            onChange={(e) => setEmailContent(e.target.value)}
            sx={{ mb: 2 }} />

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Tone (Optional)</InputLabel>
            <Select value={tone || ''}
              label={"Tone (Optional)"}
              onChange={(e) => setTone(e.target.value)}>
              <MenuItem value="">None</MenuItem>
              <MenuItem value="Professional">Professional</MenuItem>
              <MenuItem value="Casual">Casual</MenuItem>
              <MenuItem value="Friendly">Friendly</MenuItem>
            </Select>
          </FormControl>

          <Button variant='contained'
            onClick={handleSubmit}
            disabled={!emailContent || loading} fullWidth>
            {loading ? <CircularProgress size={24} /> : "Generate Reply"}
          </Button>
          {error && (
            <Typography color='error' sx={{ mb: 2 }}>
              {error}
            </Typography>

          )}
        </Box>

        {generatedReply && (
          <Box sx={{ mt: 3 }}>
            <Typography variant='h6' gutterBottom>
              Generated Reply
            </Typography>
            <TextField fullWidth
              multiline
              rows={6}
              variant='outlined'
              value={generatedReply || ''}
              inputProps={{ readOnly: true }} />
            <Button variant='outlined' sx={{ mt: 2 }}
              onClick={() => navigator.clipboard.writeText(generatedReply)}>
              Copy to clipboard
            </Button>
          </Box>
        )}
      </Container>
    </ThemeProvider>
  )
}

export default App
