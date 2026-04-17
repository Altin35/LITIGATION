/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface LitigationRecord {
  id: string;
  surveyNumber: string;
  ownerName: string;
  fatherName: string;
  village: string;
  taluk: string;
  district: string;
  caseNumber: string;
  courtName: string;
  caseType: string;
  filingDate: string;
  nextHearingDate: string;
  caseStatus: 'Pending' | 'In Progress' | 'Closed';
  advocateName: string;
  remarks: string;
  documentUrl?: string | null;
  createdDate: string;
}
