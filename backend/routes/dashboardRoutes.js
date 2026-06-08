import express from 'express';
import Company from '../models/Company.js';
import DSA from '../models/DSA.js';

const router = express.Router();

router.get('/stats', async (req, res) => {
  try {
    const companies = await Company.find();
    
    // Calculate company stats
    const totalApplications = companies.length;
    const selected = companies.filter(c => c.status === 'Selected').length;
    const rejected = companies.filter(c => c.status === 'Rejected').length;
    const inProgress = companies.filter(c => c.status === 'Interview' || c.status === 'Applied').length;
    
    // Find upcoming interviews (rounds that are pending and have a future date)
    let upcomingInterviews = [];
    companies.forEach(company => {
      company.rounds.forEach(round => {
        if (round.status === 'Pending' && round.date && new Date(round.date) >= new Date()) {
          upcomingInterviews.push({
            companyId: company._id,
            companyName: company.name,
            role: company.role,
            roundName: round.name,
            date: round.date
          });
        }
      });
    });
    
    // Sort upcoming interviews by date
    upcomingInterviews.sort((a, b) => new Date(a.date) - new Date(b.date));

    // Get simple activity data for chart (applications per day over last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const activityMap = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      activityMap[dateStr] = 0;
    }
    
    companies.forEach(company => {
      if (company.applicationDate && company.applicationDate >= sevenDaysAgo) {
        const dateStr = new Date(company.applicationDate).toISOString().split('T')[0];
        if (activityMap[dateStr] !== undefined) {
          activityMap[dateStr]++;
        }
      }
    });
    
    const activityData = Object.keys(activityMap).map(date => ({
      date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
      applications: activityMap[date]
    }));

    // DSA stats
    const dsaProblems = await DSA.find();
    const totalDSA = dsaProblems.length;
    const solvedDSA = dsaProblems.filter(p => p.status === 'Solved').length;

    res.json({
      companyStats: {
        totalApplications,
        selected,
        rejected,
        inProgress,
      },
      upcomingInterviews,
      activityData,
      dsaStats: {
        total: totalDSA,
        solved: solvedDSA
      }
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
