CALL p_create_one_meet_appt(
         str_to_date('[START_DATE]', f_system_setting('DATETIME_FORMAT', 'N')),
         str_to_date('[END_DATE]', f_system_setting('DATETIME_FORMAT', 'N')),
         [UPDATE_ID]);