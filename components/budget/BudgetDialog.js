// components/budget/BudgetDialog.js
'use client';
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
    Switch,
    FormControlLabel,
    Grid,
    Paper,
    Fade,
    Backdrop,
    Chip
} from '@mui/material';
import {
    Close as CloseIcon,
    TargetIcon,
    DollarSign,
    Plus,
    Delete,
    Category,
    RotateCcw,
    TrendingUp,
    GpsFixed,
    CurrencyRupee,
    Refresh,
    Add
} from '@mui/icons-material';
import { styled } from '@mui/system';
import useFinanceStore from '@/stores/useFinanceStore';

// Styled components
const StyledDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialog-paper': {
        borderRadius: 24,
        padding: 0,
        maxWidth: 700,
        width: '100%',
        margin: 16,
        background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        overflow: 'visible'
    }
}));

const CategoryCard = styled(Paper)(({ theme }) => ({
    padding: 16,
    borderRadius: 12,
    border: '1px solid #e5e7eb',
    background: '#f9fafb',
    transition: 'all 0.2s ease',
    '&:hover': {
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
    }
}));

const BudgetDialog = ({ open, onClose, onSuccess, budgetType, mode }) => {
    const {
        loading,
        categories,
        budgets,
        createOrUpdateBudget,
        setCategories
    } = useFinanceStore();

    const [budgetForm, setBudgetForm] = useState({
        totalBudget: '',
        autoRenew: false,
        categories: []
    });

    const [newCategory, setNewCategory] = useState({ name: '', amount: '' });

    // Initialize form when dialog opens or budget type changes
    useEffect(() => {
        if (open) {
            if (mode === 'edit' && budgets[budgetType]?.enabled) {
                const currentBudget = budgets[budgetType];
                setBudgetForm({
                    totalBudget: currentBudget.totalBudget.toString(),
                    autoRenew: currentBudget.autoRenew,
                    categories: Object.entries(currentBudget.categories).map(([name, amount]) => ({
                        name,
                        amount: amount.toString()
                    }))
                });
            } else {
                setBudgetForm({
                    totalBudget: '',
                    autoRenew: false,
                    categories: []
                });
            }
            setNewCategory({ name: '', amount: '' });
        }
    }, [open, mode, budgetType, budgets]);

    const handleTotalBudgetChange = (event) => {
        const value = event.target.value;
        if (value === '' || /^\d*\.?\d*$/.test(value)) {
            setBudgetForm(prev => ({ ...prev, totalBudget: value }));
        }
    };

    const handleAutoRenewChange = (event) => {
        setBudgetForm(prev => ({ ...prev, autoRenew: event.target.checked }));
    };

    const handleAddCategory = () => {
        if (newCategory.name && newCategory.amount) {
            const amount = parseFloat(newCategory.amount);
            if (amount > 0) {
                setBudgetForm(prev => ({
                    ...prev,
                    categories: [...prev.categories, {
                        name: newCategory.name,
                        amount: newCategory.amount
                    }]
                }));

                // Add to global categories if it's new
                if (!categories.includes(newCategory.name)) {
                    setCategories(newCategory.name);
                }

                setNewCategory({ name: '', amount: '' });
            }
        }
    };

    const handleRemoveCategory = (index) => {
        setBudgetForm(prev => ({
            ...prev,
            categories: prev.categories.filter((_, i) => i !== index)
        }));
    };

    const handleCategoryAmountChange = (index, value) => {
        if (value === '' || /^\d*\.?\d*$/.test(value)) {
            setBudgetForm(prev => ({
                ...prev,
                categories: prev.categories.map((cat, i) =>
                    i === index ? { ...cat, amount: value } : cat
                )
            }));
        }
    };

    const calculateCategoryTotal = () => {
        return budgetForm.categories.reduce((total, cat) => {
            return total + (parseFloat(cat.amount) || 0);
        }, 0);
    };

    const handleSubmit = async () => {
        try {
            const totalBudget = parseFloat(budgetForm.totalBudget);
            const categoryTotal = calculateCategoryTotal();

            if (!totalBudget || totalBudget <= 0) {
                alert('Please enter a valid total budget amount');
                return;
            }

            if (categoryTotal > totalBudget) {
                alert('Category budgets exceed total budget. Please adjust.');
                return;
            }

            const categoriesObj = {};
            budgetForm.categories.forEach(cat => {
                categoriesObj[cat.name] = parseFloat(cat.amount);
            });

            const budgetData = {
                enabled: true,
                totalBudget,
                autoRenew: budgetForm.autoRenew,
                categories: categoriesObj
            };

            const result = await createOrUpdateBudget(budgetType, budgetData);

            if (result.success) {
                alert(`${budgetType.charAt(0).toUpperCase() + budgetType.slice(1)} budget ${mode}d successfully!`);
                onSuccess();
            } else {
                alert(`Failed to ${mode} budget: ${result.message}`);
            }
        } catch (error) {
            console.error(`Error ${mode}ing budget:`, error);
            alert(`Failed to ${mode} budget`);
        }
    };

    const isFormValid = budgetForm.totalBudget && parseFloat(budgetForm.totalBudget) > 0;
    const categoryTotal = calculateCategoryTotal();
    const totalBudget = parseFloat(budgetForm.totalBudget) || 0;
    const remainingBudget = totalBudget - categoryTotal;

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
                                        <GpsFixed sx={{ fontSize: 24 }} />
                                    </Box>
                                    <Box>
                                        <Typography variant="h5" fontWeight="bold">
                                            {mode === 'edit' ? 'Edit' : 'Create'} {budgetType.charAt(0).toUpperCase() + budgetType.slice(1)} Budget
                                        </Typography>
                                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                            {mode === 'edit'
                                                ? `Update your ${budgetType} spending limits`
                                                : `Set spending limits for ${budgetType === 'monthly' ? 'this month' : 'this year'}`
                                            }
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

                    <DialogContent sx={{ p: 3, maxHeight: '70vh', overflowY: 'auto' }}>
                        {/* Total Budget */}
                        <Box mb={4}>
                            <Typography variant="h6" gutterBottom fontWeight="bold" color="text.primary">
                                Total Budget *
                            </Typography>
                            <TextField
                                fullWidth
                                placeholder="Enter total budget amount"
                                value={budgetForm.totalBudget}
                                onChange={handleTotalBudgetChange}
                                InputProps={{
                                    startAdornment: <CurrencyRupee style={{ marginRight: 8, color: '#6b7280' }} />,
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 3,
                                        fontSize: 16,
                                        '& fieldset': {
                                            borderWidth: 2,
                                        },
                                        '&:hover fieldset': {
                                            borderColor: '#667eea',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#667eea',
                                        }
                                    }
                                }}
                            />
                        </Box>

                        {/* Auto Renew */}
                        <Box mb={4}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={budgetForm.autoRenew}
                                        onChange={handleAutoRenewChange}
                                        color="primary"
                                    />
                                }
                                label={
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <Refresh sx={{ fontSize: 20, color: '#6b7280' }} />
                                        <Typography variant="body1" fontWeight="medium">
                                            Auto-renew budget next {budgetType === 'monthly' ? 'month' : 'year'}
                                        </Typography>
                                    </Box>
                                }
                            />
                        </Box>

                        {/* Budget Summary */}
                        {totalBudget > 0 && (
                            <Box mb={4}>
                                <Typography variant="h6" gutterBottom fontWeight="bold" color="text.primary">
                                    Budget Summary
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={4}>
                                        <Box textAlign="center" p={2} bgcolor="blue.50" borderRadius={2}>
                                            <Typography variant="body2" color="blue.700" fontWeight="medium">
                                                Total Budget
                                            </Typography>
                                            <Typography variant="h6" color="blue.800" fontWeight="bold">
                                                ${totalBudget.toFixed(2)}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Box textAlign="center" p={2} bgcolor="green.50" borderRadius={2}>
                                            <Typography variant="body2" color="green.700" fontWeight="medium">
                                                Allocated
                                            </Typography>
                                            <Typography variant="h6" color="green.800" fontWeight="bold">
                                                ${categoryTotal.toFixed(2)}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Box textAlign="center" p={2} bgcolor={remainingBudget >= 0 ? "gray.50" : "red.50"} borderRadius={2}>
                                            <Typography variant="body2" color={remainingBudget >= 0 ? "gray.700" : "red.700"} fontWeight="medium">
                                                Remaining
                                            </Typography>
                                            <Typography variant="h6" color={remainingBudget >= 0 ? "gray.800" : "red.800"} fontWeight="bold">
                                                ${remainingBudget.toFixed(2)}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Box>
                        )}

                        {/* Category Budgets */}
                        <Box mb={4}>
                            <Typography variant="h6" gutterBottom fontWeight="bold" color="text.primary">
                                Category Budgets
                            </Typography>

                            {/* Add New Category */}
                            <Box mb={3} p={3} bgcolor="gray.50" borderRadius={3}>
                                <Typography variant="subtitle2" gutterBottom fontWeight="medium" color="text.secondary">
                                    Add Category Budget
                                </Typography>
                                <Grid container spacing={2} alignItems="center">
                                    <Grid item xs={12} sm={5}>
                                        <Autocomplete
                                            freeSolo
                                            options={categories}
                                            value={newCategory.name}
                                            onChange={(event, newValue) => {
                                                setNewCategory(prev => ({ ...prev, name: newValue || '' }));
                                            }}
                                            onInputChange={(event, newInputValue) => {
                                                setNewCategory(prev => ({ ...prev, name: newInputValue }));
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    placeholder="Select or create category"
                                                    size="small"
                                                    InputProps={{
                                                        ...params.InputProps,
                                                        startAdornment: <Category style={{ marginRight: 8, color: '#6b7280', fontSize: 20 }} />,
                                                    }}
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            placeholder="Amount"
                                            value={newCategory.amount}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                if (value === '' || /^\d*\.?\d*$/.test(value)) {
                                                    setNewCategory(prev => ({ ...prev, amount: value }));
                                                }
                                            }}
                                            InputProps={{
                                                startAdornment: <CurrencyRupee style={{ marginRight: 4, color: '#6b7280', fontSize: 20 }} />,
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={3}>
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            onClick={handleAddCategory}
                                            disabled={!newCategory.name || !newCategory.amount}
                                            startIcon={<Add />}
                                            sx={{
                                                borderRadius: 2,
                                                textTransform: 'none',
                                                fontWeight: 600
                                            }}
                                        >
                                            Add
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Box>

                            {/* Category List */}
                            <Box>
                                {budgetForm.categories.length > 0 ? (
                                    <Box display="flex" flexDirection="column" gap={2}>
                                        {budgetForm.categories.map((category, index) => (
                                            <CategoryCard key={index}>
                                                <Grid container spacing={2} alignItems="center">
                                                    <Grid item xs={12} sm={5}>
                                                        <Box display="flex" alignItems="center" gap={1}>
                                                            <Category sx={{ color: '#6b7280', fontSize: 20 }} />
                                                            <Typography variant="body1" fontWeight="medium">
                                                                {category.name}
                                                            </Typography>
                                                        </Box>
                                                    </Grid>
                                                    <Grid item xs={12} sm={4}>
                                                        <TextField
                                                            fullWidth
                                                            size="small"
                                                            value={category.amount}
                                                            onChange={(e) => handleCategoryAmountChange(index, e.target.value)}
                                                            InputProps={{
                                                                startAdornment: <CurrencyRupee style={{ marginRight: 4, color: '#6b7280', fontSize: 20 }} />,
                                                            }}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} sm={3}>
                                                        <Box display="flex" justifyContent="flex-end">
                                                            <IconButton
                                                                onClick={() => handleRemoveCategory(index)}
                                                                sx={{
                                                                    color: '#ef4444',
                                                                    '&:hover': {
                                                                        backgroundColor: '#fee2e2'
                                                                    }
                                                                }}
                                                            >
                                                                <Delete />
                                                            </IconButton>
                                                        </Box>
                                                    </Grid>
                                                </Grid>
                                            </CategoryCard>
                                        ))}
                                    </Box>
                                ) : (
                                    <Box textAlign="center" py={4}>
                                        <Typography variant="body2" color="text.secondary">
                                            No category budgets added yet. Add categories to track spending by type.
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                        </Box>
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
                                        fontWeight: 600,
                                        fontSize: 16,
                                        textTransform: 'none',
                                        borderWidth: 2,
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
                                    disabled={!isFormValid || loading.updatingBudget}
                                    sx={{
                                        py: 2,
                                        borderRadius: 3,
                                        fontWeight: 600,
                                        fontSize: 16,
                                        textTransform: 'none',
                                        background: 'linear-gradient(135deg, #667eea, #764ba2)',
                                        boxShadow: '0 10px 25px -5px rgba(102, 126, 234, 0.3)',
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, #5a67d8, #6b46c1)',
                                        },
                                        '&:disabled': {
                                            background: '#9ca3af',
                                            boxShadow: 'none'
                                        }
                                    }}
                                >
                                    {loading.updatingBudget ? 'Saving...' : `${mode === 'edit' ? 'Update' : 'Create'} Budget`}
                                </Button>
                            </Grid>
                        </Grid>
                    </DialogActions>
                </Box>
            </Fade>
        </StyledDialog>
    );
};

export default BudgetDialog;