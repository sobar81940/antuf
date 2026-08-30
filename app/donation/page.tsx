'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Paper,
  Divider,
  Alert,
  InputAdornment,
  Chip,
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  AccountBalance as BankIcon,
  CreditCard as CardIcon,
  Payment as PaymentIcon,
  CheckCircle as CheckIcon,
  AccountBalanceWallet as WalletIcon,
  QrCode2 as QrCodeIcon,
} from '@mui/icons-material';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/footer/Footer';

export default function DonationPage() {
  const [donationType, setDonationType] = useState('one-time');
  const [amount, setAmount] = useState<string | number>('');
  const [customAmount, setCustomAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('bank');
  const [showSuccess, setShowSuccess] = useState(false);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [submittingReceipt, setSubmittingReceipt] = useState(false);
  const [donor, setDonor] = useState({ name: '', email: '', phone: '', address: '', transactionId: '' });
  const [donationData, setDonationData] = useState({
    headerTitle: 'दान गर्नुहोस्',
    headerTitleEn: 'Support Our Cause',
    headerSubtitle: 'तपाईंको सहयोगले नेपालका श्रमिकहरूको जीवनमा सकारात्मक परिवर्तन ल्याउन मद्दत गर्छ',
    impactItems: [],
    bankDetails: { bankName: '', accountName: '', accountNumber: '', branch: '' },
    paymentDetails: { qrCode: '', esewa: '', khalti: '' },
    contactEmail: '',
    contactPhone: '',
    helpText: '',
  });

  useEffect(() => {
    fetch('/api/donation', { cache: 'no-store' })
      .then((response) => response.json())
      .then((data) => {
        if (data.success && data.data) {
          setDonationData((current) => ({ ...current, ...data.data }));
        }
      })
      .catch(() => undefined);
  }, []);

  const predefinedAmounts = [500, 1000, 2000, 5000, 10000];

  const handleAmountSelect = (value) => {
    setAmount(value);
    setCustomAmount('');
  };

  const handleCustomAmount = (value) => {
    setCustomAmount(value);
    setAmount('');
  };

  const handleDonate = async () => {
    const selectedAmount = Number(amount || customAmount);
    if (!selectedAmount || selectedAmount < 1 || !donor.name || !donor.email || !receiptFile) {
      setShowSuccess(false);
      return;
    }

    try {
      setSubmittingReceipt(true);
      const uploadData = new FormData();
      uploadData.append('file', receiptFile);
      uploadData.append('folder', 'antuf/donation-receipts');
      const uploadResponse = await fetch('/api/upload', { method: 'POST', body: uploadData });
      const uploadResult = await uploadResponse.json();
      if (!uploadResponse.ok || !uploadResult.success) throw new Error(uploadResult.error || 'Receipt upload failed');

      const response = await fetch('/api/donation/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          donorName: donor.name,
          donorEmail: donor.email,
          donorPhone: donor.phone,
          donorAddress: donor.address,
          transactionId: donor.transactionId,
          amount: selectedAmount,
          donationType,
          paymentMethod,
          receiptUrl: uploadResult.url,
        }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.error || 'Receipt submission failed');
      setShowSuccess(true);
      setReceiptFile(null);
    } catch (error) {
      console.error('Error submitting donation receipt:', error);
    } finally {
      setSubmittingReceipt(false);
    }
  };

  return (
    <>
      <Navbar />

      <Box sx={{ bgcolor: '#f5f7fa', minHeight: '100vh', py: 6 }}>
        {/* Header Section */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            py: 8,
            mb: 6,
          }}
        >
          <Container maxWidth="lg">
            <FavoriteIcon sx={{ fontSize: 80, color: 'white', display: 'block', mx: 'auto', mb: 3 }} />
            <Typography
              variant="h2"
              sx={{
                color: 'white',
                fontWeight: 700,
                textAlign: 'center',
                mb: 2,
              }}
            >
              {donationData.headerTitle}
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: 'rgba(255,255,255,0.9)',
                textAlign: 'center',
                mb: 2,
              }}
            >
              {donationData.headerTitleEn}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'rgba(255,255,255,0.85)',
                textAlign: 'center',
                maxWidth: '800px',
                mx: 'auto',
              }}
            >
              {donationData.headerSubtitle}
            </Typography>
          </Container>
        </Box>

        <Container maxWidth="lg">
          {showSuccess && (
            <Alert
              severity="success"
              icon={<CheckIcon />}
              sx={{ mb: 4, fontSize: '1.1rem' }}
            >
              धन्यवाद! तपाईंको दानको लागि हामी कृतज्ञ छौं। हामीले तपाईंको इमेलमा पुष्टिकरण पठाएका छौं।
            </Alert>
          )}

          <Grid container spacing={4}>
            {/* Donation Form */}
            <Grid
              size={{
                xs: 12,
                md: 8
              }}>
              <Card sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
                  दान विवरण
                </Typography>

                {/* Donation Type */}
                <FormControl component="fieldset" sx={{ mb: 4 }}>
                  <FormLabel component="legend" sx={{ fontWeight: 600, mb: 2 }}>
                    दान प्रकार
                  </FormLabel>
                  <RadioGroup
                    row
                    value={donationType}
                    onChange={(e) => setDonationType(e.target.value)}
                  >
                    <FormControlLabel
                      value="one-time"
                      control={<Radio />}
                      label="एक पटक"
                    />
                    <FormControlLabel
                      value="monthly"
                      control={<Radio />}
                      label="मासिक"
                    />
                    <FormControlLabel
                      value="yearly"
                      control={<Radio />}
                      label="वार्षिक"
                    />
                  </RadioGroup>
                </FormControl>

                <Divider sx={{ my: 3 }} />

                {/* Amount Selection */}
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  रकम चयन गर्नुहोस्
                </Typography>

                <Grid container spacing={2} sx={{ mb: 3 }}>
                  {predefinedAmounts.map((value) => (
                    <Grid
                      key={value}
                      size={{
                        xs: 6,
                        sm: 4
                      }}>
                      <Button
                        fullWidth
                        variant={amount === value ? 'contained' : 'outlined'}
                        onClick={() => handleAmountSelect(value)}
                        sx={{
                          py: 2,
                          fontSize: '1.1rem',
                          fontWeight: 600,
                          ...(amount === value && {
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          }),
                        }}
                      >
                        NPR {value.toLocaleString()}
                      </Button>
                    </Grid>
                  ))}
                </Grid>

                {/* Custom Amount */}
                <TextField
                  fullWidth
                  label="कस्टम रकम"
                  placeholder="अन्य रकम प्रविष्ट गर्नुहोस्"
                  value={customAmount}
                  onChange={(e) => handleCustomAmount(e.target.value)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">NPR</InputAdornment>,
                  }}
                  sx={{ mb: 4 }}
                />

                <Divider sx={{ my: 3 }} />

                {/* Payment Method */}
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  भुक्तानी विधि
                </Typography>

                <FormControl component="fieldset" fullWidth sx={{ mb: 4 }}>
                  <RadioGroup
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <Paper
                      elevation={paymentMethod === 'bank' ? 3 : 0}
                      sx={{
                        p: 2,
                        mb: 2,
                        border: paymentMethod === 'bank' ? '2px solid #667eea' : '1px solid #e5e7eb',
                        cursor: 'pointer',
                      }}
                      onClick={() => setPaymentMethod('bank')}
                    >
                      <FormControlLabel
                        value="bank"
                        control={<Radio />}
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <BankIcon sx={{ color: '#667eea' }} />
                            <Box>
                              <Typography variant="body1" fontWeight={600}>
                                बैंक ट्रान्सफर
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                सिधै बैंक खातामा जम्मा गर्नुहोस्
                              </Typography>
                            </Box>
                          </Box>
                        }
                      />
                    </Paper>

                    <Paper
                      elevation={paymentMethod === 'card' ? 3 : 0}
                      sx={{
                        p: 2,
                        mb: 2,
                        border: paymentMethod === 'card' ? '2px solid #667eea' : '1px solid #e5e7eb',
                        cursor: 'pointer',
                      }}
                      onClick={() => setPaymentMethod('card')}
                    >
                      <FormControlLabel
                        value="card"
                        control={<Radio />}
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <CardIcon sx={{ color: '#667eea' }} />
                            <Box>
                              <Typography variant="body1" fontWeight={600}>
                                क्रेडिट/डेबिट कार्ड
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Visa, Mastercard, etc.
                              </Typography>
                            </Box>
                          </Box>
                        }
                      />
                    </Paper>

                    <Paper
                      elevation={paymentMethod === 'esewa' ? 3 : 0}
                      sx={{
                        p: 2,
                        mb: 2,
                        border: paymentMethod === 'esewa' ? '2px solid #667eea' : '1px solid #e5e7eb',
                        cursor: 'pointer',
                      }}
                      onClick={() => setPaymentMethod('esewa')}
                    >
                      <FormControlLabel
                        value="esewa"
                        control={<Radio />}
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <PaymentIcon sx={{ color: '#667eea' }} />
                            <Box>
                              <Typography variant="body1" fontWeight={600}>
                                eSewa
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                eSewa वालेट प्रयोग गर्नुहोस्
                              </Typography>
                            </Box>
                          </Box>
                        }
                      />
                    </Paper>

                    <Paper
                      elevation={paymentMethod === 'khalti' ? 3 : 0}
                      sx={{
                        p: 2,
                        mb: 2,
                        border: paymentMethod === 'khalti' ? '2px solid #667eea' : '1px solid #e5e7eb',
                        cursor: 'pointer',
                      }}
                      onClick={() => setPaymentMethod('khalti')}
                    >
                      <FormControlLabel
                        value="khalti"
                        control={<Radio />}
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <PaymentIcon sx={{ color: '#667eea' }} />
                            <Box>
                              <Typography variant="body1" fontWeight={600}>Khalti</Typography>
                              <Typography variant="caption" color="text.secondary">Khalti वालेट प्रयोग गर्नुहोस्</Typography>
                            </Box>
                          </Box>
                        }
                      />
                    </Paper>

                    <Paper
                      elevation={paymentMethod === 'qr' ? 3 : 0}
                      sx={{
                        p: 2,
                        border: paymentMethod === 'qr' ? '2px solid #667eea' : '1px solid #e5e7eb',
                        cursor: 'pointer',
                      }}
                      onClick={() => setPaymentMethod('qr')}
                    >
                      <FormControlLabel
                        value="qr"
                        control={<Radio />}
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <QrCodeIcon sx={{ color: '#667eea' }} />
                            <Box>
                              <Typography variant="body1" fontWeight={600}>QR Code</Typography>
                              <Typography variant="caption" color="text.secondary">QR code स्क्यान गर्नुहोस्</Typography>
                            </Box>
                          </Box>
                        }
                      />
                    </Paper>
                  </RadioGroup>
                </FormControl>

                {/* Donor Information */}
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  तपाईंको विवरण
                </Typography>

                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid
                    size={{
                      xs: 12,
                      sm: 6
                    }}>
                    <TextField fullWidth label="पूरा नाम" required value={donor.name} onChange={(e) => setDonor({ ...donor, name: e.target.value })} />
                  </Grid>
                  <Grid
                    size={{
                      xs: 12,
                      sm: 6
                    }}>
                    <TextField fullWidth label="इमेल" type="email" required value={donor.email} onChange={(e) => setDonor({ ...donor, email: e.target.value })} />
                  </Grid>
                  <Grid
                    size={{
                      xs: 12,
                      sm: 6
                    }}>
                    <TextField fullWidth label="फोन नम्बर" value={donor.phone} onChange={(e) => setDonor({ ...donor, phone: e.target.value })} />
                  </Grid>
                  <Grid
                    size={{
                      xs: 12,
                      sm: 6
                    }}>
                    <TextField fullWidth label="ठेगाना" value={donor.address} onChange={(e) => setDonor({ ...donor, address: e.target.value })} />
                  </Grid>
                </Grid>

                <TextField fullWidth label="Transaction ID" value={donor.transactionId} onChange={(e) => setDonor({ ...donor, transactionId: e.target.value })} sx={{ mb: 3 }} />
                <Button component="label" variant="outlined" fullWidth sx={{ mb: 3 }}>
                  {receiptFile ? receiptFile.name : 'Upload transaction receipt'}
                  <input hidden type="file" accept="image/*,.pdf" onChange={(e) => setReceiptFile(e.target.files?.[0] || null)} />
                </Button>

                {/* Donate Button */}
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  startIcon={<FavoriteIcon />}
                  onClick={handleDonate}
                  disabled={submittingReceipt}
                  sx={{
                    py: 2,
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
                    },
                  }}
                >
                  {submittingReceipt ? 'Submitting receipt...' : 'दान गर्नुहोस्'}
                </Button>
              </Card>
            </Grid>

            {/* Sidebar - Impact & Bank Details */}
            <Grid
              size={{
                xs: 12,
                md: 4
              }}>
              {/* Impact Card */}
              <Card sx={{ mb: 3, p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  तपाईंको प्रभाव
                </Typography>
                {donationData.impactItems.map((item) => (
                  <Box key={`${item.amount}-${item.description}`} sx={{ mb: 2 }}>
                    <Chip label={`NPR ${item.amount.toLocaleString()}`} color="primary" size="small" sx={{ mr: 1 }} />
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {item.description}
                    </Typography>
                  </Box>
                ))}
              </Card>

              {/* Bank Details */}
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                }}
              >
                <BankIcon sx={{ fontSize: 40, mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  बैंक विवरण
                </Typography>
                <Box sx={{ bgcolor: 'rgba(255,255,255,0.2)', p: 2, borderRadius: 2, mb: 1 }}>
                  <Typography variant="caption">बैंकको नाम</Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {donationData.bankDetails.bankName}
                  </Typography>
                </Box>
                <Box sx={{ bgcolor: 'rgba(255,255,255,0.2)', p: 2, borderRadius: 2, mb: 1 }}>
                  <Typography variant="caption">खाता नाम</Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {donationData.bankDetails.accountName}
                  </Typography>
                </Box>
                <Box sx={{ bgcolor: 'rgba(255,255,255,0.2)', p: 2, borderRadius: 2, mb: 1 }}>
                  <Typography variant="caption">खाता नम्बर</Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {donationData.bankDetails.accountNumber}
                  </Typography>
                </Box>
                <Box sx={{ bgcolor: 'rgba(255,255,255,0.2)', p: 2, borderRadius: 2 }}>
                  <Typography variant="caption">शाखा</Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {donationData.bankDetails.branch}
                  </Typography>
                </Box>
              </Paper>

              {(donationData.paymentDetails.qrCode || donationData.paymentDetails.esewa || donationData.paymentDetails.khalti) && (
                <Paper elevation={1} sx={{ mt: 3, p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <WalletIcon color="primary" />
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      डिजिटल भुक्तानी
                    </Typography>
                  </Box>
                  {donationData.paymentDetails.qrCode && (
                    <Box sx={{ textAlign: 'center', mb: 2 }}>
                      <Box component="img" src={donationData.paymentDetails.qrCode} alt="Donation QR code" sx={{ width: 180, height: 180, objectFit: 'contain' }} />
                      <Typography variant="caption" display="block" color="text.secondary">QR Code: Scan to donate</Typography>
                    </Box>
                  )}
                  {(donationData.paymentDetails.esewa || donationData.paymentDetails.khalti) && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {donationData.paymentDetails.esewa && <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><QrCodeIcon fontSize="small" color="success" /><Typography variant="body2"><strong>eSewa:</strong> {donationData.paymentDetails.esewa}</Typography></Box>}
                      {donationData.paymentDetails.khalti && <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><QrCodeIcon fontSize="small" color="primary" /><Typography variant="body2"><strong>Khalti:</strong> {donationData.paymentDetails.khalti}</Typography></Box>}
                    </Box>
                  )}
                </Paper>
              )}

              {/* Contact Info */}
              <Paper elevation={1} sx={{ mt: 3, p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  सहयोग चाहियो?
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {donationData.helpText}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  📧 {donationData.contactEmail}
                </Typography>
                <Typography variant="body2">
                  📞 {donationData.contactPhone}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Footer />
    </>
  );
}
