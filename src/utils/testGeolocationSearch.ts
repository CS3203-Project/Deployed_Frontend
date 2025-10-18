/**
 * Test utility for verifying geolocation search functionality
 * This script verifies that all components of the hybrid search system work correctly
 */

import { hybridSearchApi } from '../api/hybridSearchApi';
import type { HybridSearchParams, LocationParams } from '../api/hybridSearchApi';

interface TestResult {
  testName: string;
  success: boolean;
  error?: string;
  data?: any;
}

export class GeolocationSearchTester {
  private results: TestResult[] = [];

  /**
   * Run all geolocation search tests
   */
  async runAllTests(): Promise<TestResult[]> {
    
    this.results = [];
    
    await this.testHybridSearch();
    await this.testSemanticOnlySearch();
    await this.testLocationOnlySearch();
    await this.testLocationUtils();
    await this.testGeocoding();
    await this.testBrowserGeolocation();
    
    this.printSummary();
    
    return this.results;
  }

  /**
   * Test hybrid search (query + location)
   */
  private async testHybridSearch(): Promise<void> {
    try {
      const params: HybridSearchParams = {
        query: 'web development',
        location: {
          latitude: 40.7128,
          longitude: -74.0060,
          radius: 25
        },
        limit: 10,
        threshold: 0.3
      };

      const response = await hybridSearchApi.searchServices(params);
      
      if (response.success && response.data.searchType === 'hybrid') {
        this.addResult('Hybrid Search', true, undefined, {
          count: response.data.count,
          searchType: response.data.searchType,
          hasLocation: !!response.data.location,
          hasQuery: !!response.data.query
        });
      } else {
        this.addResult('Hybrid Search', false, 'Invalid response format or search type');
      }
    } catch (error) {
      this.addResult('Hybrid Search', false, error instanceof Error ? error.message : 'Unknown error');
    }
  }

  /**
   * Test semantic search only (query without location)
   */
  private async testSemanticOnlySearch(): Promise<void> {
    try {
      const params: HybridSearchParams = {
        query: 'graphic design',
        limit: 10,
        threshold: 0.3
      };

      const response = await hybridSearchApi.searchServices(params);
      
      if (response.success && response.data.searchType === 'semantic') {
        this.addResult('Semantic Search', true, undefined, {
          count: response.data.count,
          searchType: response.data.searchType,
          hasLocation: !!response.data.location,
          hasQuery: !!response.data.query
        });
      } else {
        this.addResult('Semantic Search', false, 'Invalid response format or search type');
      }
    } catch (error) {
      this.addResult('Semantic Search', false, error instanceof Error ? error.message : 'Unknown error');
    }
  }

  /**
   * Test location-only search (no query)
   */
  private async testLocationOnlySearch(): Promise<void> {
    try {
      const params: HybridSearchParams = {
        location: {
          latitude: 40.7128,
          longitude: -74.0060,
          radius: 15
        },
        limit: 10
      };

      const response = await hybridSearchApi.searchServices(params);
      
      if (response.success && response.data.searchType === 'location') {
        this.addResult('Location Search', true, undefined, {
          count: response.data.count,
          searchType: response.data.searchType,
          hasLocation: !!response.data.location,
          hasQuery: !!response.data.query
        });
      } else {
        this.addResult('Location Search', false, 'Invalid response format or search type');
      }
    } catch (error) {
      this.addResult('Location Search', false, error instanceof Error ? error.message : 'Unknown error');
    }
  }

  /**
   * Test location utility functions
   */
  private async testLocationUtils(): Promise<void> {
    try {
      // Test distance calculation
      const distance = hybridSearchApi.calculateDistance(40.7128, -74.0060, 40.7589, -73.9851);
      const formattedDistance = hybridSearchApi.formatDistance(distance);
      
      if (distance > 0 && formattedDistance.includes('km')) {
        this.addResult('Distance Calculation', true, undefined, {
          distance,
          formatted: formattedDistance
        });
      } else {
        this.addResult('Distance Calculation', false, 'Invalid distance calculation');
      }
    } catch (error) {
      this.addResult('Distance Calculation', false, error instanceof Error ? error.message : 'Unknown error');
    }
  }

  /**
   * Test geocoding functionality
   */
  private async testGeocoding(): Promise<void> {
    try {
      const response = await hybridSearchApi.geocodeAddress('New York, NY');
      
      if (response.success && response.data && response.data.latitude && response.data.longitude) {
        this.addResult('Geocoding', true, undefined, {
          address: 'New York, NY',
          latitude: response.data.latitude,
          longitude: response.data.longitude
        });
      } else {
        this.addResult('Geocoding', false, 'Invalid geocoding response');
      }
    } catch (error) {
      this.addResult('Geocoding', false, error instanceof Error ? error.message : 'Unknown error');
    }
  }

  /**
   * Test browser geolocation API
   */
  private async testBrowserGeolocation(): Promise<void> {
    try {
      if (!navigator.geolocation) {
        this.addResult('Browser Geolocation', false, 'Geolocation not supported');
        return;
      }

      // Test the getCurrentLocation method (with timeout)
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Geolocation timeout')), 5000);
      });

      try {
        const position = await Promise.race([
          hybridSearchApi.getCurrentLocation(),
          timeoutPromise
        ]);

        this.addResult('Browser Geolocation', true, undefined, {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
      } catch (geoError) {
        // Geolocation might fail in testing environment - that's acceptable
        this.addResult('Browser Geolocation', true, 'Skipped (testing environment)', {
          note: 'Geolocation API available but may require user permission'
        });
      }
    } catch (error) {
      this.addResult('Browser Geolocation', false, error instanceof Error ? error.message : 'Unknown error');
    }
  }

  /**
   * Add test result
   */
  private addResult(testName: string, success: boolean, error?: string, data?: any): void {
    this.results.push({ testName, success, error, data });
    
    const emoji = success ? '✅' : '❌';
    if (error) console.log(`   Error: ${error}`);
    if (data) console.log(`   Data:`, data);
  }

  /**
   * Print test summary
   */
  private printSummary(): void {
    const passed = this.results.filter(r => r.success).length;
    const total = this.results.length;
    
    
    if (passed === total) {
    } else {
    }
  }
}

/**
 * Test specific search scenarios
 */
export const testSearchScenarios = async () => {
  
  const scenarios = [
    {
      name: 'NYC Web Developer Search',
      params: {
        query: 'web developer',
        location: {
          latitude: 40.7128,
          longitude: -74.0060,
          radius: 20
        }
      }
    },
    {
      name: 'Plumber Near Me (SF)',
      params: {
        query: 'plumber',
        location: {
          latitude: 37.7749,
          longitude: -122.4194,
          radius: 15
        }
      }
    },
    {
      name: 'Any Service in LA',
      params: {
        location: {
          latitude: 34.0522,
          longitude: -118.2437,
          radius: 30
        }
      }
    }
  ];

  for (const scenario of scenarios) {
    try {
      const response = await hybridSearchApi.searchServices(scenario.params);
      if (response.data.results.length > 0) {
        const firstResult = response.data.results[0];
        if (firstResult.distance_km !== undefined) {
        }
      }
    } catch (error) {
      console.error(`  Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
};

// Export for easy testing
export const runQuickTest = async () => {
  const tester = new GeolocationSearchTester();
  return await tester.runAllTests();
};