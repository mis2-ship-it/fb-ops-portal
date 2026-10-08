import { NextResponse } from 'next/server';

const GOOGLE_CSV = "https://docs.google.com/spreadsheets/d/1HlYNDNXig3PCjIFpQdI8B1lEzubsttUEPj_57DgpJoE/gviz/tq?tqx=out:csv&sheet=Complaints";
const SWIGGY_CSV = "https://docs.google.com/spreadsheets/d/1R5kdiLGiNV2zSxs2hyObxUF216iqeaDVTggM7mub0Ck/gviz/tq?tqx=out:csv&sheet=Raw%20Data";
const ZOMATO_CSV = "https://docs.google.com/spreadsheets/d/1V-tFd3I9CRxDUWSrU9Zc6ODW9Qhbs4C0SXZq4mW6tsg/gviz/tq?tqx=out:csv&sheet=Raw%20Data";

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === ',' && !inQuotes) {
      result.push(cur.trim());
      cur = '';
    } else {
      cur += c;
    }
  }
  result.push(cur.trim());
  return result;
}

function parseRowDate(dateStr: string, isDMY = false): Date | null {
  if (!dateStr) return null;
  const cleaned = dateStr.replace(/["']/g, '').trim();
  const parts = cleaned.split(/[-/ ]/);
  if (parts.length < 3) {
    const d = new Date(cleaned);
    return isNaN(d.getTime()) ? null : d;
  }
  let day: number, month: number, year: number;
  if (isDMY) {
    day = parseInt(parts[0], 10);
    month = parseInt(parts[1], 10) - 1;
    year = parseInt(parts[2].slice(0, 4), 10);
  } else {
    month = parseInt(parts[0], 10) - 1;
    day = parseInt(parts[1], 10);
    year = parseInt(parts[2].slice(0, 4), 10);
  }
  if (year < 100) year += 2000;
  const d = new Date(year, month, day);
  return isNaN(d.getTime()) ? null : d;
}

interface DimensionMetrics {
  prevRatingSum: number;
  prevRatingCount: number;
  currRatingSum: number;
  currRatingCount: number;
  prevRatedOrders: number;
  currRatedOrders: number;
  prevIssueOrders: number;
  currIssueOrders: number;
  prevStars: Record<number, number>;
  currStars: Record<number, number>;
}

function createEmptyMetric(): DimensionMetrics {
  return {
    prevRatingSum: 0,
    prevRatingCount: 0,
    currRatingSum: 0,
    currRatingCount: 0,
    prevRatedOrders: 0,
    currRatedOrders: 0,
    prevIssueOrders: 0,
    currIssueOrders: 0,
    prevStars: { 1: 0
