"use client"

import React from 'react';
import PageLayout from "@/components/layouts/PageLayout";
import styles from '@/components/CustomStyles';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { useState } from 'react';
import ProfileSettings from '../../components/settings/ProfileSettings';
import PasswordSettings from '../../components/settings/PasswordSettings';
import { ProtectedRoute } from "@/components/helpers/RouteProtection";

const Settings = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (index: number) => {
    setActiveTab(index)
  }

  return (
    <ProtectedRoute>
      <PageLayout>
        <main className={styles.pagePad}>
          <h1 className='text-3xl font-semibold mb-2'>Settings</h1>
          <section className='bg-white rounded-md p-3 py-6'>
            <Tabs>
              <TabList className="md:mx-4 font-semibold flex gap-6 border-b-2">
                <Tab 
                  className={`${activeTab === 0 ? 'underline underline-offset-8': ' '} cursor-pointer`}
                  onClick={() => handleTabChange(0)}
                >
                  Profile
                </Tab>
                <Tab 
                  className={`${activeTab === 2 ? 'underline underline-offset-8': ' '}  cursor-pointer`}
                  onClick={() => handleTabChange(2)}
                >
                  Password
                </Tab>
              </TabList>

              <TabPanel>
                <ProfileSettings />
              </TabPanel>
              <TabPanel>
                <PasswordSettings />
              </TabPanel>
            </Tabs>
          </section>
        </main>
      </PageLayout>
    </ProtectedRoute>
  )
}

export default Settings
