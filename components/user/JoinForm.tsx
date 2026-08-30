'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import NepaliDatePicker from '../admin/event-calendar/NepaliDatePicker';
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Typography,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Alert,
  Grid,
  Container,
  LinearProgress,
  Card,
  CardContent,
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import SendIcon from '@mui/icons-material/Send';

const JoinForm = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    // Personal Information
    nameEnglish: '',
    nameNepali: '',
    dobNepali: '',
    gender: '',
    address: '',
    district: '',
    province: '',
    municipality: '',
    wardNo: '',
    phone: '',
    email: '',
    // Work Information
    occupation: '',
    workplace: '',
    position: '',
    // Union Information
    unionName: '',
    membershipNumber: '',
    joinDate: '',
    // Additional Information
    recommendations: '',
    interests: '',
    skills: '',
    emergencyContact: '',
    emergencyPhone: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({
      ...prev,
      dobNepali: date
    }));
  };

  const validateStep = () => {
    if (step === 1) {
      if (!formData.nameEnglish || !formData.nameNepali || !formData.dobNepali || !formData.gender) {
        setError('कृपया सबै आवश्यक फिल्डहरू भर्नुहोस् / Please fill all required fields');
        return false;
      }
      if (!formData.phone || !formData.email) {
        setError('कृपया सम्पर्क विवरण भर्नुहोस् / Please fill contact details');
        return false;
      }
    }
    if (step === 2) {
      if (!formData.occupation || !formData.workplace) {
        setError('कृपया कार्य विवरण भर्नुहोस् / Please fill work details');
        return false;
      }
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep()) {
      setStep(prev => prev + 1);
      setError('');
    }
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/user/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        router.push('/dashboard/user/success');
      } else {
        throw new Error(data.error || 'Failed to submit form');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('सबमिट गर्न असफल भयो / Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <Box sx={{ mt: 3 }}>
      <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)' }}>
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 1 }}>
            व्यक्तिगत जानकारी | Personal Information
          </Typography>
          <Typography variant="body2" sx={{ color: '#555' }}>
            कृपया आफ्नो व्यक्तिगत विवरण भर्नुहोस्
          </Typography>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        <Grid
          size={{
            xs: 12,
            md: 6
          }}>
          <TextField
            fullWidth
            required
            label="पूरा नाम (नेपालीमा)"
            name="nameNepali"
            value={formData.nameNepali}
            onChange={handleInputChange}
            placeholder="उदाहरण: राम बहादुर श्रेष्ठ"
            variant="outlined"
          />
        </Grid>

        <Grid
          size={{
            xs: 12,
            md: 6
          }}>
          <TextField
            fullWidth
            required
            label="Full Name (English)"
            name="nameEnglish"
            value={formData.nameEnglish}
            onChange={handleInputChange}
            placeholder="Example: Ram Bahadur Shrestha"
            variant="outlined"
          />
        </Grid>

        <Grid
          size={{
            xs: 12,
            md: 6
          }}>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: '#555' }}>
            जन्म मिति (नेपाली) <span style={{ color: 'red' }}>*</span>
          </Typography>
          <NepaliDatePicker
            value={formData.dobNepali}
            onChange={handleDateChange}
          />
        </Grid>

        <Grid
          size={{
            xs: 12,
            md: 6
          }}>
          <TextField
            fullWidth
            required
            select
            label="लिङ्ग | Gender"
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            variant="outlined"
          >
            <MenuItem value="">छान्नुहोस् / Select</MenuItem>
            <MenuItem value="male">पुरुष | Male</MenuItem>
            <MenuItem value="female">महिला | Female</MenuItem>
            <MenuItem value="other">अन्य | Other</MenuItem>
          </TextField>
        </Grid>

        <Grid
          size={{
            xs: 12,
            md: 6
          }}>
          <TextField
            fullWidth
            required
            select
            label="प्रदेश | Province"
            name="province"
            value={formData.province}
            onChange={handleInputChange}
            variant="outlined"
          >
            <MenuItem value="">प्रदेश छान्नुहोस्</MenuItem>
            <MenuItem value="कोशी">कोशी प्रदेश</MenuItem>
            <MenuItem value="मधेश">मधेश प्रदेश</MenuItem>
            <MenuItem value="बागमती">बागमती प्रदेश</MenuItem>
            <MenuItem value="गण्डकी">गण्डकी प्रदेश</MenuItem>
            <MenuItem value="लुम्बिनी">लुम्बिनी प्रदेश</MenuItem>
            <MenuItem value="कर्णाली">कर्णाली प्रदेश</MenuItem>
            <MenuItem value="सुदूरपश्चिम">सुदूरपश्चिम प्रदेश</MenuItem>
          </TextField>
        </Grid>

        <Grid
          size={{
            xs: 12,
            md: 6
          }}>
          <TextField
            fullWidth
            required
            label="जिल्ला | District"
            name="district"
            value={formData.district}
            onChange={handleInputChange}
            placeholder="उदाहरण: काठमाडौं"
            variant="outlined"
          />
        </Grid>

        <Grid
          size={{
            xs: 12,
            md: 6
          }}>
          <TextField
            fullWidth
            label="गा.पा./न.पा. | Municipality"
            name="municipality"
            value={formData.municipality}
            onChange={handleInputChange}
            placeholder="उदाहरण: काठमाडौं महानगरपालिका"
            variant="outlined"
          />
        </Grid>

        <Grid
          size={{
            xs: 12,
            md: 6
          }}>
          <TextField
            fullWidth
            label="वडा नं | Ward No."
            name="wardNo"
            value={formData.wardNo}
            onChange={handleInputChange}
            placeholder="उदाहरण: १२"
            variant="outlined"
          />
        </Grid>

        <Grid size={12}>
          <TextField
            fullWidth
            label="ठेगाना | Address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="उदाहरण: टोल, सडक"
            variant="outlined"
          />
        </Grid>

        <Grid
          size={{
            xs: 12,
            md: 6
          }}>
          <TextField
            fullWidth
            required
            label="फोन नम्बर | Phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="९८********"
            variant="outlined"
          />
        </Grid>

        <Grid
          size={{
            xs: 12,
            md: 6
          }}>
          <TextField
            fullWidth
            required
            label="इमेल | Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="example@email.com"
            variant="outlined"
          />
        </Grid>

        <Grid
          size={{
            xs: 12,
            md: 6
          }}>
          <TextField
            fullWidth
            label="आपतकालीन सम्पर्क व्यक्ति | Emergency Contact"
            name="emergencyContact"
            value={formData.emergencyContact}
            onChange={handleInputChange}
            placeholder="नाम"
            variant="outlined"
          />
        </Grid>

        <Grid
          size={{
            xs: 12,
            md: 6
          }}>
          <TextField
            fullWidth
            label="आपतकालीन फोन | Emergency Phone"
            name="emergencyPhone"
            type="tel"
            value={formData.emergencyPhone}
            onChange={handleInputChange}
            placeholder="९८********"
            variant="outlined"
          />
        </Grid>
      </Grid>
    </Box>
  );

  const renderStep2 = () => (
    <Box sx={{ mt: 3 }}>
      <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)' }}>
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#388E3C', mb: 1 }}>
            कार्य सम्बन्धी जानकारी | Work Information
          </Typography>
          <Typography variant="body2" sx={{ color: '#555' }}>
            कृपया आफ्नो कार्य सम्बन्धी विवरण भर्नुहोस्
          </Typography>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        <Grid
          size={{
            xs: 12,
            md: 6
          }}>
          <TextField
            fullWidth
            required
            label="पेशा | Occupation"
            name="occupation"
            value={formData.occupation}
            onChange={handleInputChange}
            placeholder="उदाहरण: शिक्षक, व्यापारी"
            variant="outlined"
          />
        </Grid>

        <Grid
          size={{
            xs: 12,
            md: 6
          }}>
          <TextField
            fullWidth
            required
            label="कार्यस्थल | Workplace"
            name="workplace"
            value={formData.workplace}
            onChange={handleInputChange}
            placeholder="उदाहरण: ABC विद्यालय"
            variant="outlined"
          />
        </Grid>

        <Grid
          size={{
            xs: 12,
            md: 6
          }}>
          <TextField
            fullWidth
            label="पद | Position"
            name="position"
            value={formData.position}
            onChange={handleInputChange}
            placeholder="उदाहरण: प्रधानाध्यापक"
            variant="outlined"
          />
        </Grid>

        <Grid size={12}>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="सीप | Skills"
            name="skills"
            value={formData.skills}
            onChange={handleInputChange}
            placeholder="उदाहरण: कम्प्युटर, लेखन, वक्तृत्व"
            variant="outlined"
          />
        </Grid>
      </Grid>
    </Box>
  );

  const renderStep3 = () => (
    <Box sx={{ mt: 3 }}>
      <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #F3E5F5 0%, #E1BEE7 100%)' }}>
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#7B1FA2', mb: 1 }}>
            संघ सम्बन्धी जानकारी | Union Information
          </Typography>
          <Typography variant="body2" sx={{ color: '#555' }}>
            कृपया संघ सम्बन्धी विवरण भर्नुहोस्
          </Typography>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        <Grid
          size={{
            xs: 12,
            md: 6
          }}>
          <TextField
            fullWidth
            label="संघको नाम | Union Name"
            name="unionName"
            value={formData.unionName}
            onChange={handleInputChange}
            placeholder="उदाहरण: नेपाल शिक्षक युनियन"
            variant="outlined"
          />
        </Grid>

        <Grid
          size={{
            xs: 12,
            md: 6
          }}>
          <TextField
            fullWidth
            label="सदस्यता नम्बर | Membership Number"
            name="membershipNumber"
            value={formData.membershipNumber}
            onChange={handleInputChange}
            placeholder="उदाहरण: 12345"
            variant="outlined"
          />
        </Grid>

        <Grid size={12}>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="रुचि | Interests"
            name="interests"
            value={formData.interests}
            onChange={handleInputChange}
            placeholder="उदाहरण: खेलकुद, संगीत, सामाजिक सेवा"
            variant="outlined"
          />
        </Grid>

        <Grid size={12}>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="सिफारिस | Recommendations"
            name="recommendations"
            value={formData.recommendations}
            onChange={handleInputChange}
            placeholder="सिफारिस गर्ने व्यक्तिको नाम र सम्पर्क"
            variant="outlined"
          />
        </Grid>
      </Grid>
    </Box>
  );

  const steps = ['व्यक्तिगत जानकारी', 'कार्य जानकारी', 'संघ जानकारी'];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 1 }}>
            ANTUF मा सामेल हुनुहोस्
          </Typography>
          <Typography variant="h6" sx={{ color: '#666' }}>
            Join All Nepal Trade Union Federation
          </Typography>
        </Box>

        {/* Stepper */}
        <Box sx={{ mb: 4 }}>
          <Stepper activeStep={step - 1} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {/* Progress Bar */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Step {step} of 3
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {steps[step - 1]}
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={(step / 3) * 100} 
            sx={{ 
              height: 8, 
              borderRadius: 4,
              backgroundColor: '#e0e0e0',
              '& .MuiLinearProgress-bar': {
                borderRadius: 4,
                background: 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)'
              }
            }}
          />
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}

          {/* Navigation Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4, pt: 3, borderTop: '1px solid #e0e0e0' }}>
            <Button
              variant="outlined"
              onClick={prevStep}
              disabled={step === 1}
              startIcon={<NavigateBeforeIcon />}
              sx={{ 
                px: 3, 
                py: 1.5,
                fontSize: '1rem',
                textTransform: 'none',
                fontWeight: 600
              }}
            >
              पछाडि | Previous
            </Button>

            {step < 3 ? (
              <Button
                variant="contained"
                onClick={nextStep}
                endIcon={<NavigateNextIcon />}
                sx={{ 
                  px: 3, 
                  py: 1.5,
                  fontSize: '1rem',
                  textTransform: 'none',
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)'
                  }
                }}
              >
                अगाडि | Next
              </Button>
            ) : (
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                endIcon={<SendIcon />}
                sx={{ 
                  px: 3, 
                  py: 1.5,
                  fontSize: '1rem',
                  textTransform: 'none',
                  fontWeight: 600,
                  background: loading 
                    ? '#bdbdbd' 
                    : 'linear-gradient(135deg, #2e7d32 0%, #66bb6a 100%)',
                  '&:hover': {
                    background: loading 
                      ? '#bdbdbd' 
                      : 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)'
                  }
                }}
              >
                {loading ? 'सबमिट गर्दै...' : 'सबमिट गर्नुहोस् | Submit'}
              </Button>
            )}
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default JoinForm;