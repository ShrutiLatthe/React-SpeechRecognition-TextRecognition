import React, { useState, useEffect } from 'react';
import 'regenerator-runtime/runtime';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import useClipboard from 'react-use-clipboard';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic'; // Import the Mic icon
import StopIcon from '@mui/icons-material/Stop'; // Import the Stop icon
import './App.css';
import VolumeUpIcon from '@mui/icons-material/VolumeUp'; // Import the VolumeUp icon
import { useSpeechSynthesis } from 'react-speech-kit';

const commonTypographyStyle = {
  fontFamily: 'Arial, sans-serif',
};

const buttonStyle = {
  m: 2,
  '&:hover': {
    cursor: 'pointer',
  },
};

function App() {
  const [textToCopy, setTextToCopy] = useState();
  const [isCopied, setCopied] = useClipboard(textToCopy);
  const [isRecording, setRecording] = useState(false);

  const startListening = () => {
    SpeechRecognition.startListening({ continuous: true, language: 'en-IN' });
    setRecording(true);
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
    setRecording(false);
  };

  const { transcript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    return null;
  }
  useEffect(() => {
    if (transcript) {
      // Do something with the updated transcript here
      console.log('Transcript changed:', transcript);
      setTextToCopy(transcript);
    }
  }, [transcript]);
  const handleCopy = () => {
    setTextToCopy(transcript);
    setCopied(!isCopied);
  };
  const { speak } = useSpeechSynthesis();
  return (
    <div className="app-container">
      <Card sx={{ maxWidth: 700 }}>
        <CardActionArea>
          <CardContent>
            <Typography
              gutterBottom
              variant="h5"
              component="div"
              sx={commonTypographyStyle}
            >
              <h2>Speech to Text Converter</h2>
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ ...commonTypographyStyle, mt: 2 }}
            >
               <VolumeUpIcon sx={{ mr: 1 }} onClick={() => speak({ text: transcript })} /> {/* Speak icon */}
              {transcript}
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <Button
            sx={{ ...buttonStyle, ...commonTypographyStyle }}
            variant="contained"
            onClick={handleCopy}
            disabled={isRecording} // Disable the button while recording
          >
            {isCopied ? 'Copied!' : 'Copy to clipboard'}
          </Button>
          <Button
            sx={{
              ...buttonStyle,
              backgroundColor: isRecording ? '#00a152' : '#f44336', // Green for recording, Red for not recording
              '&:hover': {
                backgroundColor: isRecording ? '#a2cf6e' : '#aa2e25',
              },
              ...commonTypographyStyle,
            }}
            variant="contained"
            onClick={isRecording ? stopListening : startListening}
          >
            {isRecording ? (
              <StopIcon /> // Show Stop icon during recording
            ) : (
              <MicIcon /> // Show Mic icon when not recording
            )}
            {isRecording ? 'Stop Recording' : 'Start Recording'}
          </Button>
        </CardActions>
      </Card>
    </div>
  );
}

export default App;
