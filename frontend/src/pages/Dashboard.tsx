import { useState } from 'react';
import { 
  Users, 
  Ticket, 
  AlertCircle, 
  TrendingUp,
  Filter,
  Save
} from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState('Today');

  const metrics = {
    agentsOnline: 21,
    unassignedTickets: 37,
    queuesBreachingSoon: 5,
    avgLoadPerAgent: 8.4
  };

  const agents = [
    { name: 'Leslie Alexander', open: 12, highUrgent: 4, avgTime: '9m', status: 'Online' },
    { name: 'Devon Lane', open: 7, highUrgent: 2, avgTime: '11m', status: 'Online' },
    { name: 'Jenny Wilson', open: 15, highUrgent: 6, avgTime: '13m', status: 'At Capacity' },
    { name: 'Guy Hawkins', open: 5, highUrgent: 1, avgTime: '10m', status: 'Away' },
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <div className="dashboard-controls">
          <div className="time-range">
            {['Today', '7d', '30d'].map((range) => (
              <button
                key={range}
                className={timeRange === range ? 'active' : ''}
                onClick={() => setTimeRange(range)}
              >
                {range}
              </button>
            ))}
          </div>
          <div className="filters">
            <button className="filter-btn">
              <Users size={16} />
              All teams
            </button>
            <button className="filter-btn">
              <Users size={16} />
              Role: Admin
            </button>
            <button className="save-view-btn">
              <Save size={16} />
              Save View
            </button>
          </div>
        </div>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Agents Online</span>
          </div>
          <div className="metric-value">{metrics.agentsOnline}</div>
          <div className="metric-change positive">+3 vs yesterday</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Unassigned Tickets</span>
          </div>
          <div className="metric-value">{metrics.unassignedTickets}</div>
          <div className="metric-change">Need assignment</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Queues Breaching Soon</span>
          </div>
          <div className="metric-value">{metrics.queuesBreachingSoon}</div>
          <div className="metric-change warning">Within 1h</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Avg Load per Agent</span>
          </div>
          <div className="metric-value">{metrics.avgLoadPerAgent}</div>
          <div className="metric-change">Target ≤ 10</div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3>Assignment Activity</h3>
          <div className="chart-legend">
            <div className="legend-item">
              <span className="legend-dot blue"></span>
              <span>Assigned</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot yellow"></span>
              <span>Reassigned</span>
            </div>
          </div>
          <div className="chart-placeholder">Bar/area chart placeholder</div>
        </div>

        <div className="chart-card">
          <h3>Team Capacity</h3>
          <div className="chart-legend">
            <div className="legend-item">
              <span className="legend-dot green"></span>
              <span>Available</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot orange"></span>
              <span>At Risk</span>
            </div>
          </div>
          <div className="chart-placeholder">Donut chart placeholder</div>
        </div>

        <div className="chart-card">
          <h3>Priority Mix (Unassigned)</h3>
          <div className="chart-legend">
            <div className="legend-item">
              <span className="legend-dot red"></span>
              <span>Urgent</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot blue"></span>
              <span>High</span>
            </div>
            <div className="legend-item">
              <span>Others</span>
            </div>
          </div>
          <div className="chart-placeholder">Stacked bar placeholder</div>
        </div>
      </div>

      <div className="tables-grid">
        <div className="table-card">
          <div className="table-header">
            <h3>Unassigned Tickets</h3>
            <button className="table-filter">
              <Filter size={16} />
              Priority: All
            </button>
          </div>
          <div className="table-placeholder">Table content placeholder</div>
        </div>

        <div className="table-card">
          <div className="table-header">
            <h3>Agents & Load</h3>
            <button className="table-filter">
              <Users size={16} />
              Team: All
            </button>
          </div>
          <table className="agents-table">
            <thead>
              <tr>
                <th>Agent</th>
                <th>Open</th>
                <th>High/Urgent</th>
                <th>Avg Time to First Reply</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {agents.map((agent, idx) => (
                <tr key={idx}>
                  <td>{agent.name}</td>
                  <td>{agent.open}</td>
                  <td>{agent.highUrgent}</td>
                  <td>{agent.avgTime}</td>
                  <td>
                    <span className={`status-badge ${agent.status.toLowerCase().replace(' ', '-')}`}>
                      {agent.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

