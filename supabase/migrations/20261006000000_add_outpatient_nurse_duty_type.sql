alter table public.duty_shifts
  drop constraint if exists duty_shifts_duty_type_check;

alter table public.duty_shifts
  add constraint duty_shifts_duty_type_check
  check (duty_type in ('staff', 'trainee', 'nurse', 'outpatient_nurse'));
