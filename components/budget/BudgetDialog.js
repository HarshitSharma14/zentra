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

// Styled components with enhanced design
const StyledDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialog-paper': {
        borderRadius: 24,
        padding: 0,
        maxWidth: 750,
        width: '100%',
        margin: 16,
        background: 'linear-gradient(145deg, oklch(1 0 0) 0%, oklch(0.99 0.002 106.423) 100%)',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        overflow: 'visible',
        border: '1px solid oklch(0.9 0.02 248.089)',
        [theme.breakpoints.down('sm')]: {
            margin: 8,
            borderRadius: 20
        }
    }
}));

const CategoryCard = styled(Paper)(({ theme }) => ({
    padding: '24px',
    borderRadius: 16,
    border: '1px solid oklch(0.9 0.02 248.089)',
    background: 'oklch(1 0 0)',
    transition: 'all 0.3s ease',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    '&:hover': {
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        transform: 'translateY(-2px)',
        background: 'oklch(0.99 0.002 106.423)',
        borderColor: 'oklch(0.567 0.191 255.391)'
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
                        p: 4,
                        pb: 3,
                        background: 'linear-gradient(135deg, oklch(0.567 0.191 255.391) 0%, oklch(0.5 0.18 280) 100%)',
                        color: 'oklch(0.99 0.002 106.423)',
                        position: 'relative',
                        overflow: 'hidden',
                        borderTopLeftRadius: 24,
                        borderTopRightRadius: 24,
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
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

                    <DialogContent sx={{ p: 3, mt: 3, maxHeight: '70vh', overflowY: 'auto' }}>
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
                                    startAdornment: <CurrencyRupee style={{ marginRight: 8, color: 'oklch(0.576 0.068 252.453)' }} />,
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 3,
                                        fontSize: 16,
                                        padding: '6px 12px',
                                        background: 'oklch(1 0 0)',
                                        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                                        transition: 'all 0.2s ease',
                                        '& fieldset': {
                                            borderWidth: 1.5,
                                            borderColor: 'oklch(0.9 0.02 248.089)',
                                        },
                                        '&:hover': {
                                            boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.1)',
                                            '& fieldset': {
                                                borderColor: 'oklch(0.567 0.191 255.391)',
                                            }
                                        },
                                        '&.Mui-focused': {
                                            boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.1)',
                                            '& fieldset': {
                                                borderColor: 'oklch(0.567 0.191 255.391)',
                                                borderWidth: 2,
                                            }
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
                                <Grid container spacing={2} justifyContent="space-around">
                                    <Grid item width="30%" xs={4}>
                                        <Box textAlign="center" p={3} bgcolor="oklch(0.96 0.04 220)" borderRadius={3} sx={{ boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', border: '1px solid oklch(0.9 0.08 220)' }}>
                                            <Typography variant="body2" sx={{ color: 'oklch(0.4 0.15 220)' }} fontWeight="medium">
                                                Total Budget
                                            </Typography>
                                            <Typography variant="h6" sx={{ color: 'oklch(0.3 0.18 220)' }} fontWeight="bold">
                                                ₹{totalBudget.toFixed(2)}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item width="30%" xs={4}>
                                        <Box textAlign="center" p={3} bgcolor="oklch(0.96 0.04 142)" borderRadius={3} sx={{ boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', border: '1px solid oklch(0.9 0.08 142)' }}>
                                            <Typography variant="body2" sx={{ color: 'oklch(0.4 0.15 142)' }} fontWeight="medium">
                                                Allocated
                                            </Typography>
                                            <Typography variant="h6" sx={{ color: 'oklch(0.3 0.18 142)' }} fontWeight="bold">
                                                ₹{categoryTotal.toFixed(2)}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item width="30%" xs={4}>
                                        <Box textAlign="center" p={3} bgcolor={remainingBudget >= 0 ? "oklch(0.961 0.013 248.089)" : "oklch(0.96 0.04 29)"} borderRadius={3} sx={{ boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', border: remainingBudget >= 0 ? '1px solid oklch(0.9 0.02 248.089)' : '1px solid oklch(0.9 0.08 29)' }}>
                                            <Typography variant="body2" sx={{ color: remainingBudget >= 0 ? 'oklch(0.576 0.068 252.453)' : 'oklch(0.4 0.15 29)' }} fontWeight="medium">
                                                Remaining
                                            </Typography>
                                            <Typography variant="h6" sx={{ color: remainingBudget >= 0 ? 'oklch(0.353 0.068 252.453)' : 'oklch(0.3 0.18 29)' }} fontWeight="bold">
                                                ₹{remainingBudget.toFixed(2)}
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
                            <Box mb={4} p={4} bgcolor="oklch(0.96 0.015 248.089)" borderRadius={4} border="2px dashed oklch(0.567 0.191 255.391)" sx={{ boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
                                <Typography variant="h6" gutterBottom fontWeight="600" sx={{ color: 'oklch(0.567 0.191 255.391)', mb: 3 }}>
                                    Add New Category
                                </Typography>
                                <Grid container spacing={3} justifyContent="space-between" alignItems="end">
                                    <Grid item xs={12} sm={5} width="45%">
                                        <Typography variant="body2" fontWeight="medium" sx={{ mb: 1, color: 'oklch(0.234 0.048 252.366)' }}>
                                            Category Name
                                        </Typography>
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
                                                    InputProps={{
                                                        ...params.InputProps,
                                                        startAdornment: <Category style={{ marginRight: 8, color: 'oklch(0.576 0.068 252.453)', fontSize: 18 }} />,
                                                    }}
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            borderRadius: 3,
                                                            background: 'oklch(1 0 0)',
                                                            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                                                            transition: 'all 0.2s ease',
                                                            height: '48px',
                                                            '& fieldset': {
                                                                borderColor: 'oklch(0.9 0.02 248.089)',
                                                                borderWidth: '1.5px'
                                                            },
                                                            '&:hover fieldset': {
                                                                borderColor: 'oklch(0.567 0.191 255.391)',
                                                            },
                                                            '&.Mui-focused fieldset': {
                                                                borderColor: 'oklch(0.567 0.191 255.391)',
                                                                borderWidth: '2px'
                                                            }
                                                        }
                                                    }}
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={4} width="30%">
                                        <Typography variant="body2" fontWeight="medium" sx={{ mb: 1, color: 'oklch(0.234 0.048 252.366)' }}>
                                            Budget Amount
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            placeholder="Enter amount"
                                            value={newCategory.amount}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                if (value === '' || /^\d*\.?\d*$/.test(value)) {
                                                    setNewCategory(prev => ({ ...prev, amount: value }));
                                                }
                                            }}
                                            InputProps={{
                                                startAdornment: <CurrencyRupee style={{ marginRight: 8, color: 'oklch(0.576 0.068 252.453)', fontSize: 18 }} />,
                                            }}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 3,
                                                    background: 'oklch(1 0 0)',
                                                    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                                                    transition: 'all 0.2s ease',
                                                    height: '48px',
                                                    '& fieldset': {
                                                        borderColor: 'oklch(0.9 0.02 248.089)',
                                                        borderWidth: '1.5px'
                                                    },
                                                    '&:hover fieldset': {
                                                        borderColor: 'oklch(0.567 0.191 255.391)',
                                                    },
                                                    '&.Mui-focused fieldset': {
                                                        borderColor: 'oklch(0.567 0.191 255.391)',
                                                        borderWidth: '2px'
                                                    }
                                                }
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={3} width="15%">
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            onClick={handleAddCategory}
                                            disabled={!newCategory.name || !newCategory.amount}
                                            startIcon={<Add />}
                                            sx={{
                                                borderRadius: 3,
                                                textTransform: 'none',
                                                fontWeight: 600,
                                                height: '48px',
                                                background: 'oklch(0.567 0.191 255.391)',
                                                color: 'oklch(0.99 0.002 106.423)',
                                                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                                                transition: 'all 0.2s ease',
                                                '&:hover': {
                                                    background: 'oklch(0.5 0.18 255.391)',
                                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                                    transform: 'translateY(-1px)'
                                                },
                                                '&:disabled': {
                                                    background: 'oklch(0.576 0.068 252.453)',
                                                    color: 'oklch(0.8 0.02 252.453)',
                                                    transform: 'none'
                                                }
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
                                    <Box display="flex" flexDirection="column" gap={3}>
                                        {budgetForm.categories.map((category, index) => (
                                            <CategoryCard key={index}>
                                                <Grid container spacing={3} justifyContent="space-between" alignItems="center">
                                                    <Grid width="50%" item xs={12} sm={6}>
                                                        <Box display="flex" alignItems="center" gap={2}>
                                                            <Box sx={{
                                                                p: 1,
                                                                borderRadius: 2,
                                                                background: 'oklch(0.961 0.013 248.089)',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center'
                                                            }}>
                                                                <Category sx={{ color: 'oklch(0.567 0.191 255.391)', fontSize: 18 }} />
                                                            </Box>
                                                            <Typography variant="body1" fontWeight="600" sx={{ color: 'oklch(0.234 0.048 252.366)' }}>
                                                                {category.name}
                                                            </Typography>
                                                        </Box>
                                                    </Grid>
                                                    <Grid item width="30%" xs={8} sm={4}>
                                                        <TextField
                                                            fullWidth
                                                            placeholder="Enter amount"
                                                            value={category.amount}
                                                            onChange={(e) => handleCategoryAmountChange(index, e.target.value)}
                                                            InputProps={{
                                                                startAdornment: <CurrencyRupee style={{ marginRight: 8, color: 'oklch(0.576 0.068 252.453)', fontSize: 18 }} />,
                                                            }}
                                                            sx={{
                                                                '& .MuiOutlinedInput-root': {
                                                                    borderRadius: 3,
                                                                    background: 'oklch(0.99 0.002 106.423)',
                                                                    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                                                                    transition: 'all 0.2s ease',
                                                                    fontSize: '16px',
                                                                    height: '48px',
                                                                    '& fieldset': {
                                                                        borderColor: 'oklch(0.9 0.02 248.089)',
                                                                        borderWidth: '1.5px'
                                                                    },
                                                                    '&:hover fieldset': {
                                                                        borderColor: 'oklch(0.567 0.191 255.391)',
                                                                    },
                                                                    '&.Mui-focused fieldset': {
                                                                        borderColor: 'oklch(0.567 0.191 255.391)',
                                                                        borderWidth: '2px'
                                                                    }
                                                                }
                                                            }}
                                                        />
                                                    </Grid>
                                                    <Grid item width="10%" xs={4} sm={2}>
                                                        <Box display="flex" justifyContent="flex-end">
                                                            <IconButton
                                                                onClick={() => handleRemoveCategory(index)}
                                                                sx={{
                                                                    color: 'oklch(0.628 0.258 29.234)',
                                                                    background: 'oklch(0.95 0.04 29.234)',
                                                                    borderRadius: 2.5,
                                                                    width: 44,
                                                                    height: 44,
                                                                    transition: 'all 0.2s ease',
                                                                    '&:hover': {
                                                                        backgroundColor: 'oklch(0.93 0.06 29.234)',
                                                                        transform: 'scale(1.05)',
                                                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                                                    }
                                                                }}
                                                            >
                                                                <Delete sx={{ fontSize: 20 }} />
                                                            </IconButton>
                                                        </Box>
                                                    </Grid>
                                                </Grid>
                                            </CategoryCard>
                                        ))}
                                    </Box>
                                ) : (
                                    <Box textAlign="center" py={6} px={4} bgcolor="oklch(0.961 0.013 248.089)" borderRadius={3} border="1px dashed oklch(0.9 0.02 248.089)">
                                        <Category sx={{ fontSize: 48, color: 'oklch(0.576 0.068 252.453)', mb: 2 }} />
                                        <Typography variant="h6" fontWeight="medium" sx={{ color: 'oklch(0.234 0.048 252.366)', mb: 1 }}>
                                            No categories added yet
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'oklch(0.576 0.068 252.453)' }}>
                                            Add categories above to track spending by type and set budget limits.
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                        </Box>
                    </DialogContent>

                    <DialogActions sx={{ p: 3, pt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    onClick={onClose}
                                    sx={{
                                        py: 2.5,
                                        borderRadius: 3,
                                        fontWeight: 600,
                                        fontSize: 16,
                                        textTransform: 'none',
                                        borderWidth: 1.5,
                                        borderColor: 'oklch(0.9 0.02 248.089)',
                                        color: 'oklch(0.576 0.068 252.453)',
                                        background: 'oklch(1 0 0)',
                                        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                            borderWidth: 1.5,
                                            borderColor: 'oklch(0.567 0.191 255.391)',
                                            background: 'oklch(0.961 0.013 248.089)',
                                            boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.1)',
                                            transform: 'translateY(-1px)'
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
                                        py: 2.5,
                                        borderRadius: 3,
                                        fontWeight: 600,
                                        fontSize: 16,
                                        textTransform: 'none',
                                        background: 'oklch(0.567 0.191 255.391)',
                                        color: 'oklch(0.99 0.002 106.423)',
                                        boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.1)',
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                            background: 'oklch(0.5 0.18 255.391)',
                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                                            transform: 'translateY(-1px)'
                                        },
                                        '&:disabled': {
                                            background: 'oklch(0.576 0.068 252.453)',
                                            color: 'oklch(0.8 0.02 252.453)',
                                            boxShadow: 'none',
                                            transform: 'none'
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