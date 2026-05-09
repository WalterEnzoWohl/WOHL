import { useEffect } from 'react';
import { useNavigate } from 'react-router';

export default function HistoryPage() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/metrics', { replace: true });
  }, [navigate]);
  return null;
}
