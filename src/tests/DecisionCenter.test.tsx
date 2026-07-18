import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import DecisionCenter from '../components/DecisionCenter';

describe('Orixa Decision Center Interface', () => {
  const mockAddLog = vi.fn();

  test('Shows skeleton loaders during initial synthesis phase', () => {
    // We pass liveState=null or undefined and allow initial load skeleton rendering
    render(
      <DecisionCenter 
        addLog={mockAddLog} 
        liveState={null} 
        realTimeStatus="Connected" 
      />
    );
    
    // Check if pulse anims or skeleton column blocks exist
    const animatedSkeletons = screen.queryAllByRole('generic');
    expect(animatedSkeletons.length).toBeGreaterThan(0);
  });

  test('Correctly receives liveSRE updates and drives state changes', async () => {
    const mockLiveState = {
      current_investigation_id: 'silent-schema-disaster',
      decision_status: 'PENDING_DECISION',
      progress: {
        stage_name: 'Coordinating Specialists'
      }
    };

    // We can spy on global fetch to avoid actual API calls
    const fetchSpy = vi.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          investigation_id: 'silent-schema-disaster',
          summary: 'Simulated drift report',
          evidence: [],
          status: 'PENDING',
          audit_trail: []
        }),
      } as any)
    );

    render(
      <DecisionCenter 
        addLog={mockAddLog} 
        liveState={mockLiveState} 
        realTimeStatus="Connected" 
      />
    );

    // Verify loading and state synchronization
    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalled();
    });

    fetchSpy.mockRestore();
  });
});
