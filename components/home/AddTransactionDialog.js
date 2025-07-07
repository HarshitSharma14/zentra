// components/home/AddTransactionDialog.js
import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Autocomplete,
    Button,
    Box,
    Typography,
    IconButton,
    Chip,
    Switch,
    FormControlLabel,
    Grid,
    Paper,
    Fade,
    Backdrop
} from '@mui/material';
import {
    Close as CloseIcon,
    TrendingUp,
    TrendingDown,
    AttachMoney,
    Category,
    Notes,
    Schedule
} from '@mui/icons-material';
import { styled } from '@mui/system';
import useFinanceStore from '@/stores/useFinanceStore';
import { IndianRupee } from 'lucide-react';

// Styled components for better visuals
const StyledDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialog-paper': {
        borderRadius: 24,
        padding: 0,
        maxWidth: 600,
        width: '100%',
        margin: 16,
        background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        overflow: 'visible'
    }
}));

const TransactionTypeCard = styled(Paper)(({ theme, selected, type }) => ({
    padding: 20,
    borderRadius: 16,
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    border: selected
        ? `3px solid ${type === 'income' ? '#10b981' : '#ef4444'}`
        : '2px solid #e5e7eb',
    background: selected
        ? type === 'income'
            ? 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)'
            : 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)'
        : '#ffffff',
    transform: selected ? 'scale(1.02)' : 'scale(1)',
    boxShadow: selected
        ? `0 20px 25px -5px ${type === 'income' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`
        : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    '&:hover': {
        transform: 'scale(1.02)',
        boxShadow: `0 20px 25px -5px ${type === 'income' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)'}`
    }
}));

const InputContainer = styled(Box)({
    position: 'relative',
    marginBottom: 24
});

const FloatingLabel = styled(Typography)(({ focused, hasValue }) => ({
    position: 'absolute',
    left: 12,
    top: focused || hasValue ? -8 : 16,
    fontSize: focused || hasValue ? 12 : 16,
    fontWeight: 600,
    color: focused ? '#3b82f6' : '#6b7280',
    backgroundColor: '#ffffff',
    padding: '0 8px',
    borderRadius: 4,
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    pointerEvents: 'none',
    zIndex: 1
}));

const AddTransactionDialog = ({ open, onClose, onSuccess, editTransaction = null }) => {
    const { user, summaryData, addTransaction, updateTransaction, setCategories, loading, categories } = useFinanceStore();

    const [transactionForm, setTransactionForm] = useState({
        amount: '',
        category: '',
        description: '',
        date: new Date().toISOString().slice(0, 16),
        type: 'expense'
    });

    const [focusedField, setFocusedField] = useState(null);
    const [errors, setErrors] = useState({});

    // Reset form when dialog opens or populate with edit data
    useEffect(() => {
        if (open) {
            if (editTransaction) {
                // Populate form with existing transaction data
                const transactionDate = new Date(editTransaction.date);
                const formattedDate = transactionDate.toISOString().slice(0, 16);

                setTransactionForm({
                    amount: Math.abs(editTransaction.amount).toString(),
                    category: editTransaction.category || '',
                    description: editTransaction.description || '',
                    date: formattedDate,
                    type: editTransaction.amount > 0 ? 'income' : 'expense'
                });
            } else {
                // Reset form for new transaction
                setTransactionForm({
                    amount: '',
                    category: '',
                    description: '',
                    date: new Date().toISOString().slice(0, 16),
                    type: 'expense'
                });
            }
            setErrors({});
            setFocusedField(null);
        }
    }, [open, editTransaction]);

    // Validation
    const validateForm = () => {
        const newErrors = {};

        if (!transactionForm.amount || parseFloat(transactionForm.amount) <= 0) {
            newErrors.amount = 'Amount must be greater than 0';
        }

        if (!transactionForm.category.trim()) {
            newErrors.category = 'Category is required';
        }

        if (!transactionForm.date) {
            newErrors.date = 'Date is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            // Check if category is new and add to user categories
            const trimmedCategory = transactionForm.category.trim();
            if (!categories.includes(trimmedCategory)) {
                await setCategories(trimmedCategory);
            }

            const transactionData = {
                amount: transactionForm.type === 'expense'
                    ? parseFloat(-1 * transactionForm.amount)
                    : parseFloat(transactionForm.amount),
                category: trimmedCategory,
                description: transactionForm.description.trim(),
                date: transactionForm.date,
                runningBalance: summaryData.totalBalance
            }

            let result;
            if (editTransaction) {
                // Update existing transaction
                result = await updateTransaction(editTransaction._id, transactionData, editTransaction);
            } else {
                // Add new transaction
                result = await addTransaction(transactionData);
            }

            if (result.success) {
                onSuccess?.();
                onClose();
            } else {
                alert(`Failed to ${editTransaction ? 'update' : 'add'} transaction: ${result.message}`);
            }
        } catch (error) {
            console.error(`Error ${editTransaction ? 'updating' : 'adding'} transaction:`, error);
            alert(`Failed to ${editTransaction ? 'update' : 'add'} transaction`);
        }
    };

    const isFormValid = transactionForm.amount &&
        transactionForm.category &&
        transactionForm.date &&
        parseFloat(transactionForm.amount) > 0;

    return (
        <StyledDialog
            open={open}
            onClose={onClose}
            maxWidth={false}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
                style: { backgroundColor: 'rgba(0, 0, 0, 0.7)' }
            }}
        >
            <Fade in={open}>
                <Box>
                    {/* Header */}
                    <DialogTitle sx={{
                        p: 3,
                        pb: 2,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        position: 'relative',
                        overflow: 'hidden',
                        borderTopLeftRadius: 24,
                        borderTopRightRadius: 24
                    }}>
                        <Box sx={{ position: 'relative', zIndex: 1 }}>
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                                <Box display="flex" alignItems="center" gap={2}>
                                    <Box sx={{
                                        p: 1.5,
                                        borderRadius: 2,
                                        background: 'rgba(255, 255, 255, 0.2)',
                                        backdropFilter: 'blur(10px)'
                                    }}>
                                        <IndianRupee sx={{ fontSize: 24 }} />
                                    </Box>
                                    <Box>
                                        <Typography variant="h5" fontWeight="bold">
                                            {editTransaction ? 'Edit Transaction' : 'Add Transaction'}
                                        </Typography>
                                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                            {editTransaction ? 'Update your transaction details' : 'Track your income and expenses'}
                                        </Typography>
                                    </Box>
                                </Box>
                                <IconButton
                                    onClick={onClose}
                                    sx={{
                                        color: 'white',
                                        background: 'rgba(255, 255, 255, 0.1)',
                                        '&:hover': {
                                            background: 'rgba(255, 255, 255, 0.2)'
                                        }
                                    }}
                                >
                                    <CloseIcon />
                                </IconButton>
                            </Box>
                        </Box>
                        {/* Decorative elements */}
                        <Box sx={{
                            position: 'absolute',
                            top: -50,
                            right: -50,
                            width: 100,
                            height: 100,
                            borderRadius: '50%',
                            background: 'rgba(255, 255, 255, 0.1)',
                            zIndex: 0
                        }} />
                    </DialogTitle>

                    <DialogContent sx={{ p: 3 }}>
                        {/* Transaction Type Selection */}
                        <Box my={2}>
                            <Typography variant="h5" gutterBottom fontWeight="bold" color="text.primary">
                                Transaction Type
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <TransactionTypeCard
                                        selected={transactionForm.type === 'expense'}
                                        type="expense"
                                        onClick={() => setTransactionForm({ ...transactionForm, type: 'expense' })}
                                    >
                                        <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
                                            <TrendingDown sx={{
                                                fontSize: 32,
                                                color: transactionForm.type === 'expense' ? '#ef4444' : '#6b7280'
                                            }} />
                                            <Typography variant="h6" fontWeight="bold" color="text.primary">
                                                Expense
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" textAlign="center">
                                                Money going out
                                            </Typography>
                                        </Box>
                                    </TransactionTypeCard>
                                </Grid>
                                <Grid item xs={6}>
                                    <TransactionTypeCard
                                        selected={transactionForm.type === 'income'}
                                        type="income"
                                        onClick={() => setTransactionForm({ ...transactionForm, type: 'income' })}
                                    >
                                        <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
                                            <TrendingUp sx={{
                                                fontSize: 32,
                                                color: transactionForm.type === 'income' ? '#10b981' : '#6b7280'
                                            }} />
                                            <Typography variant="h6" fontWeight="bold" color="text.primary">
                                                Income
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" textAlign="center">
                                                Money coming in
                                            </Typography>
                                        </Box>
                                    </TransactionTypeCard>
                                </Grid>
                            </Grid>
                        </Box>

                        {/* Amount and Date */}
                        <Grid container spacing={3} >
                            <Grid item xs={12} sm={6}>
                                <InputContainer>
                                    {/* <FloatingLabel
                                        focused={focusedField === 'amount'}
                                        hasValue={!!transactionForm.amount}
                                    >
                                        Amount (₹) *
                                    </FloatingLabel> */}
                                    <TextField
                                        label="Amount"

                                        fullWidth
                                        type="number"
                                        value={transactionForm.amount}
                                        onChange={(e) => setTransactionForm({ ...transactionForm, amount: e.target.value })}
                                        onFocus={() => setFocusedField('amount')}
                                        onBlur={() => setFocusedField(null)}
                                        placeholder="0.00"
                                        inputProps={{ step: "0.01", min: "0" }}
                                        error={!!errors.amount}
                                        helperText={errors.amount}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 3,
                                                fontSize: 18,
                                                fontWeight: 600,
                                                '& fieldset': {
                                                    borderWidth: 2,
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: transactionForm.type === 'income' ? '#10b981' : '#ef4444',
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: transactionForm.type === 'income' ? '#10b981' : '#ef4444',
                                                }
                                            }
                                        }}
                                    />
                                </InputContainer>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <InputContainer>
                                    {/* <FloatingLabel
                                        focused={focusedField === 'date'}
                                        hasValue={!!transactionForm.date}
                                    >
                                        Date & Time *
                                    </FloatingLabel> */}
                                    <TextField
                                        label="Date & Time"
                                        fullWidth
                                        type="datetime-local"
                                        value={transactionForm.date}
                                        onChange={(e) => setTransactionForm({ ...transactionForm, date: e.target.value })}
                                        onFocus={() => setFocusedField('date')}
                                        onBlur={() => setFocusedField(null)}
                                        error={!!errors.date}
                                        helperText={errors.date}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 3,
                                                '& fieldset': {
                                                    borderWidth: 2,
                                                }
                                            }
                                        }}
                                    />
                                </InputContainer>
                            </Grid>
                        </Grid>

                        {/* Category Autocomplete */}
                        <InputContainer>
                            <Autocomplete
                                freeSolo
                                options={categories}
                                value={transactionForm.category}
                                getOptionLabel={(option) => option || ''}
                                onChange={(event, newValue) => {
                                    setTransactionForm({ ...transactionForm, category: newValue || '' });
                                }}
                                onInputChange={(event, newInputValue) => {
                                    setTransactionForm({ ...transactionForm, category: newInputValue });
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        // label="Category"
                                        {...params}
                                        placeholder="Select or create category"
                                        onFocus={() => setFocusedField('category')}
                                        onBlur={() => setFocusedField(null)}
                                        error={!!errors.category}
                                        helperText={errors.category}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 3,
                                                '& fieldset': {
                                                    borderWidth: 2,
                                                }
                                            }
                                        }}
                                    />
                                )}
                                // renderTags={(tagValue, getTagProps) =>
                                //     tagValue.map((option, index) => (
                                //         <Chip
                                //             label={option}
                                //             {...getTagProps({ index })}
                                //             key={`${option}-${index}`} // ✅ unique and stable key
                                //             sx={{
                                //                 background: transactionForm.type === 'income'
                                //                     ? 'linear-gradient(135deg, #dcfce7, #bbf7d0)'
                                //                     : 'linear-gradient(135deg, #fee2e2, #fecaca)',
                                //                 fontWeight: 600
                                //             }}
                                //         />
                                //     ))
                                // }
                                sx={{
                                    '& .MuiAutocomplete-inputRoot': {
                                        paddingTop: '10px !important'
                                    }
                                }}
                            />
                        </InputContainer>

                        {/* Description */}
                        <InputContainer>
                            {/* <FloatingLabel
                                focused={focusedField === 'description'}
                                hasValue={!!transactionForm.description}
                            >
                                Description (Optional)
                            </FloatingLabel> */}
                            <TextField
                                label="Description (Optional)"
                                fullWidth
                                multiline
                                rows={3}
                                value={transactionForm.description}
                                onChange={(e) => setTransactionForm({ ...transactionForm, description: e.target.value })}
                                onFocus={() => setFocusedField('description')}
                                onBlur={() => setFocusedField(null)}
                                inputProps={{ maxLength: 200 }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 3,
                                        '& fieldset': {
                                            borderWidth: 2,
                                        }
                                    }
                                }}
                            />
                            <Typography variant="caption" color="text.secondary" sx={{ float: 'right', mt: 1 }}>
                                {transactionForm.description.length}/200 characters
                            </Typography>
                        </InputContainer>
                    </DialogContent>

                    <DialogActions sx={{ p: 3, pt: 0 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    onClick={onClose}
                                    sx={{
                                        py: 2,
                                        borderRadius: 3,
                                        borderWidth: 2,
                                        fontWeight: 600,
                                        fontSize: 16,
                                        textTransform: 'none',
                                        '&:hover': {
                                            borderWidth: 2,
                                        }
                                    }}
                                >
                                    Cancel
                                </Button>
                            </Grid>
                            <Grid item xs={6}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    onClick={handleSubmit}
                                    disabled={!isFormValid || loading.addingTransaction || loading.updatingTransaction}
                                    sx={{
                                        py: 2,
                                        borderRadius: 3,
                                        fontWeight: 600,
                                        fontSize: 16,
                                        textTransform: 'none',
                                        background: transactionForm.type === 'income'
                                            ? 'linear-gradient(135deg, #10b981, #059669)'
                                            : 'linear-gradient(135deg, #ef4444, #dc2626)',
                                        boxShadow: `0 10px 25px -5px ${transactionForm.type === 'income' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'
                                            }`,
                                        '&:hover': {
                                            background: transactionForm.type === 'income'
                                                ? 'linear-gradient(135deg, #059669, #047857)'
                                                : 'linear-gradient(135deg, #dc2626, #b91c1c)',
                                        },
                                        '&:disabled': {
                                            background: '#9ca3af',
                                            boxShadow: 'none'
                                        }
                                    }}
                                >
                                    {loading.addingTransaction ? 'Adding...' :
                                        loading.updatingTransaction ? 'Updating...' :
                                            editTransaction ? 'Update Transaction' : 'Add Transaction'}
                                </Button>
                            </Grid>
                        </Grid>
                    </DialogActions>
                </Box>
            </Fade>
        </StyledDialog>
    );
};

export default AddTransactionDialog;