import React, { useEffect, useRef } from 'react';
import { Radio } from 'lucide-react';

export default function CommentaryLog({ events }) {
  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [events]);

  return (
    <div className="commentary-card">
      <div className="section-title" style={{ marginBottom: '0.5rem' }}>
        <Radio color="#06b6d4" size={18} />
        <span>LIVE COMMENTARY FEED</span>
      </div>

      <div className="commentary-list" ref={listRef}>
        {(!events || events.length === 0) ? (
          <div style={{ color: 'var(--text-dim)', fontSize: '0.85rem', fontStyle: 'italic', padding: '1rem 0' }}>
            Match commentary will stream live here as points are played...
          </div>
        ) : (
          events.map((evt, idx) => (
            <div key={idx} className="commentary-item">
              {evt}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
